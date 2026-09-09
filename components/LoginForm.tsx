'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError('Email ou mot de passe incorrect.');

      return;
    }
    // Récupérer la session
    const session = await authClient.getSession();
    console.log('===== AUTH DEBUG =====');
    console.log('SESSION:', session);
    console.log('USER:', session.data?.user);
    console.log('NIVEAU:', session.data?.user?.niveau);
    console.log('ROLE:', session.data?.user?.role);
    console.log('=====================');
    const niveau = session.data?.user.niveau;

    switch (niveau) {
      case 'GERANT':
        router.push('/admin');
        break;

      case 'SECRETAIRE':
        router.push('/secretaire');
        break;

      case 'AGENT':
        router.push('/employee');
        break;

      default:
        router.push('/');
    }
    // router.push('/dashboard');
  }

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white rounded-xl shadow p-6 space-y-6"
    >
      {/*<h2 className="text-xl font-bold">Connexion</h2>*/}

      <input
        className="border rounded p-2 w-full"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <input
          className="border rounded p-2 pr-10 w-full"
          placeholder="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={
            showPassword
              ? 'Masquer le mot de passe'
              : 'Afficher le mot de passe'
          }
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <button className="bg-green-600 text-white p-2 w-full rounded">
        Connexion
      </button>
    </form>
  );
}
