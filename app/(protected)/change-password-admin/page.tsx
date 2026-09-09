import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import ChangePasswordAdminForm from '@/components/ChangePasswordAdminForm';

export default async function ChangePasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Pas connecté
  if (!session) {
    redirect('/signin');
  }

  // Connecté mais pas ADMIN
  if (session.user.role !== 'admin') {
    redirect('/signin');
  }
  if (session.user.niveau !== 'GERANT') {
    redirect('/signin'); // ou "/unauthorized"
  }
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-6 text-2xl font-bold">
          Changer mot de passe utilisateur
        </h1>

        <ChangePasswordAdminForm />
      </div>
    </main>
  );
}
