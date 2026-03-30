import { redirect } from 'next/navigation'

export default function AdminIndexPage() {
  // Langsung arahkan (redirect) siapapun yang membuka '/admin' kosong ke '/admin/activities'
  redirect('/admin/activities')
}
