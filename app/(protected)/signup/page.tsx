import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
//import Image from 'next/image';
import RegisterForm from '@/components/RegisterForm';
//import GoogleButton from '@/components/GoogleButton';
import Link from 'next/link';

export default async function SignupPage() {
 const session = await auth.api.getSession({
  headers: await headers(),
});

  return (
    // <main className="min-h-screen flex items-center justify-center bg-gray-50">
    //   <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow">

    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>
        <RegisterForm />
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">OU</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>
        {/* <GoogleButton />*/}{' '}
        <Link
          href="/change-password-admin"
          className="block text-center text-blue-600 hover:underline"
        >
          Changer mot de passe utilisateurs
        </Link>
      </div>
    </main>
  );
}
