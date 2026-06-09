import { getCurrentAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const user = await getCurrentAdmin();
  redirect(user ? '/admin' : '/login');
}
