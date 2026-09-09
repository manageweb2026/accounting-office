import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import ChangePasswordForm from '@/components/ChangePasswordForm';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/signin');
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Changer le mot de passe
        </h1>

        <ChangePasswordForm />
      </div>
    </main>
  );
}
