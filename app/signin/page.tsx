import LoginForm from '@/components/LoginForm';
import GoogleButton from '@/components/GoogleButton';
import Link from 'next/link';

export default function SignIn() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-8 shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

        <LoginForm />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />

          <span className="text-sm text-gray-500">OU</span>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <GoogleButton />

        {/* <p className="text-center text-sm text-gray-600">
          Vous n&apos;avez pas de compte ?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p> */}
      </div>
    </main>
  );
}
