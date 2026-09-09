'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!token) {
      setError('Le lien de réinitialisation est invalide.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(
          error.message || 'Impossible de réinitialiser le mot de passe.',
        );
        return;
      }

      setSuccess('Mot de passe modifié avec succès.');

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-xl bg-white p-6 shadow space-y-5"
    >
      <h1 className="text-2xl font-bold text-center">Nouveau mot de passe</h1>

      <div>
        <label className="font-semibold">Nouveau mot de passe</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="font-semibold">Confirmer le mot de passe</label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Modification...' : 'Modifier le mot de passe'}
      </button>

      <div className="text-center">
        <Link href="/signin" className="text-sm text-blue-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
