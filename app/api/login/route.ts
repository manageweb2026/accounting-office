import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
//import Image from 'next/image';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si l'utilisateur n'est pas connecté

  if (!session) {
    redirect('/signin');
  }

  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin');

    case 'SECRETAIRE':
      redirect('/secretaire');

    case 'AGENT':
      redirect('/employee');

    default:
      redirect('/signin');
  }

  
}
