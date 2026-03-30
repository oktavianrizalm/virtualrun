'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitManualRun(formData: FormData) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get form details
  const file = formData.get('proof_image') as File
  const distanceStr = formData.get('distance') as string
  const timeStr = formData.get('time') as string

  if (!file || !distanceStr || !timeStr) {
    redirect('/error?message=Data tidak lengkap')
  }

  // Validasi ukuran file di backend (batas 200KB)
  if (file.size > 200 * 1024) {
    redirect('/error?message=Foto ditolak: Ukuran file melebihi 200KB. Silakan gunakan kompresor gambar.')
  }

  // Convert distance to meters (1 km = 1000 meters)
  const distanceMeters = parseFloat(distanceStr) * 1000

  // Convert time to seconds
  const timeParts = timeStr.trim().split(':').map(Number)
  let movingTimeSeconds = 0
  if (timeParts.length === 3) {
    movingTimeSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
  } else if (timeParts.length === 2) {
    movingTimeSeconds = timeParts[0] * 60 + timeParts[1]
  } else {
    movingTimeSeconds = timeParts[0] 
  }

  // 1. Upload to Supabase Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `manual_${user.id}_${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('run_proofs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload Image Error:', uploadError)
    redirect(`/error?message=Gagal mengunggah foto: ${encodeURIComponent(uploadError.message)}`)
  }

  // Get the public URL of the uploaded image
  const { data: { publicUrl } } = supabase
    .storage
    .from('run_proofs')
    .getPublicUrl(fileName)

  // 2. Insert into activities table
  // Make a unique dummy ID since they don't use real Strava API
  const activityId = `manual_ocr_${Date.now()}`

  const { error: insertError } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      strava_activity_id: activityId,
      name: 'Manual OCR Upload',
      distance: distanceMeters,
      moving_time: movingTimeSeconds,
      start_date: new Date().toISOString(),
      type: 'Run',
      manual_proof_url: publicUrl,
      approval_status: 'pending'
    })

  if (insertError) {
    console.error('Insert Activity Error:', insertError)
    redirect(`/error?message=Gagal menyimpan aktivitas: ${encodeURIComponent(insertError.message)}`)
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath('/leaderboard')
  redirect('/dashboard')
}
