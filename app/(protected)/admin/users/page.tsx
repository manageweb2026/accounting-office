import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Pas connecté
  if (!session) {
    redirect('/signin');
  }

  // Pas administrateur
  if (session.user.niveau !== 'GERANT') {
    redirect('/signin');
  }

  return <UsersClient role={session.user.role ?? 'user'} />;
}
