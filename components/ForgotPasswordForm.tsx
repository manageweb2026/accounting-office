'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Crée une URL absolue (ex: http://localhost:3000/reset-password)
      const redirectToUrl = `${window.location.origin}/reset-password`;

      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: redirectToUrl,
      });

      if (error) {
        setError(error.message || 'Une erreur est survenue.');
        return;
      }

      setMessage(
        'Si cette adresse existe, un e-mail de réinitialisation a été envoyé.',
      );

      setEmail('');
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
      <h1 className="text-2xl font-bold text-center">Mot de passe oublié</h1>

      <p className="text-sm text-gray-600 text-center">
        Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
      </p>

      <div>
        <label className="font-semibold">Adresse e-mail</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {message && <p className="text-sm text-green-600">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Envoyer le lien'}
      </button>

      <div className="text-center">
        <Link href="/signin" className="text-sm text-blue-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
