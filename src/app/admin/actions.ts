'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logger } from '@/utils/logger'

// Utilitas pengecekan hak akses sebelum melakukan mutasi berat
async function requireAuthAndRole(allowedRoles: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.log('security', 'Unauthenticated admin attempt')
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    logger.log('security', `Blocked ${profile?.role || 'user'} from accessing admin function`, { userId: user.id })
    throw new Error('Forbidden')
  }

  return { user, role: profile.role }
}

// Inisialisasi Admin Client untuk melewati Row Level Security (RLS) demi aksi panitia
function getSuperAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// --- FUNGSI MODERATOR & ADMIN ---

export async function processManualUpload(formData: FormData) {
  // Hanya admin dan moderator yang boleh menyetujui/menolak unggahan
  await requireAuthAndRole(['admin', 'moderator'])
  
  const action = formData.get('action') as 'approve' | 'reject'
  const activityId = formData.get('activity_id') as string

  if (!activityId || !action) return

  const adminDb = getSuperAdmin()

  const status = action === 'approve' ? 'approved' : 'rejected'

  const { error } = await adminDb
    .from('activities')
    .update({ approval_status: status })
    .eq('id', activityId)

  if (error) {
    logger.log('error', `Gagal mengubah status aktivitas ${activityId}`, { error: error.message })
    redirect(`/error?message=Gagal memproses unggahan: ${encodeURIComponent(error.message)}`)
  }

  logger.log('info', `Aktivitas ${activityId} di-tanda-tangan sebagai ${status} oleh panitia`)
  
  revalidatePath('/admin/activities')
  revalidatePath('/leaderboard') // Leaderboard diupdate agar skor yang di-approve masuk
  redirect('/admin/activities')
}

export async function deleteActivityAction(formData: FormData) {
  await requireAuthAndRole(['admin', 'moderator'])
  
  const activityId = formData.get('activity_id') as string
  if (!activityId) return

  const adminDb = getSuperAdmin()
  const { error } = await adminDb
    .from('activities')
    .delete()
    .eq('id', activityId)

  if (error) {
    logger.log('error', `Gagal menghapus aktivitas ${activityId}`, { error: error.message })
    redirect(`/error?message=Gagal menghapus data: ${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/activities')
  revalidatePath('/leaderboard')
  redirect('/admin/activities')
}

// --- FUNGSI SUPER ADMIN EKSKLUSIF ---

export async function updateUserRoleAction(formData: FormData) {
  // HANYA admin yang bisa menaikkan/menurunkan jabatan user lain
  const caller = await requireAuthAndRole(['admin'])
  
  const targetUserId = formData.get('target_user_id') as string
  const newRole = formData.get('new_role') as string

  // Mencegah Admin mencopot jabatannya sendiri secara sengaja (anti-lockout)
  if (targetUserId === caller.user.id && newRole !== 'admin') {
    redirect('/error?message=Anda+tidak+bisa+menurunkan+Pangkat+PRIBADI+Anda+sendiri.')
  }

  if (!targetUserId || !newRole) return

  const adminDb = getSuperAdmin()
  const { error } = await adminDb
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) {
    redirect(`/error?message=Gagal mengubah hak akses: ${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function forceResetPasswordAction(formData: FormData) {
  await requireAuthAndRole(['admin'])
  
  const email = formData.get('email') as string
  if (!email) return

  const adminDb = getSuperAdmin()
  const origin = process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  // Supabase Auth Admin dapat mengirimkan tautan reset secara paksa ke peserta yang kehilangan aksesnya
  const { error } = await adminDb.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    redirect(`/error?message=Gagal mengirim tiket reset: ${encodeURIComponent(error.message)}`)
  }

  // Jika sukses, kita kembali tanpa membawa parameter url berkat redirect yang mulus
  revalidatePath('/admin/users')
  redirect('/admin/users?success=reset_sent')
}
