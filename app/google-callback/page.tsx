'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleRedirect() {
      try {
        const session = await authClient.getSession();

        console.log('===== GOOGLE AUTH =====');
        console.log('SESSION:', session);
        console.log('USER:', session.data?.user);
        console.log('NIVEAU:', session.data?.user.niveau);
        console.log('ROLE:', session.data?.user.role);
        console.log('======================');

        if (session.error || !session.data?.user) {
          router.replace('/signin');
          return;
        }

        const niveau = session.data.user.niveau;

        switch (niveau) {
          case 'GERANT':
            router.replace('/admin');
            break;

          case 'SECRETAIRE':
            router.replace('/secretaire');
            break;

          case 'AGENT':
            router.replace('/employee');
            break;

          default:
            console.error('Niveau inconnu:', niveau);
            router.replace('/');
        }
      } catch (error) {
        console.error('Erreur Google callback:', error);
        router.replace('/signin');
      }
    }

    handleRedirect();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Connexion avec Google...</p>
    </main>
  );
}
