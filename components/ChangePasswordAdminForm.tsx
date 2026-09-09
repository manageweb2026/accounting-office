'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client'; // Votre fichier auth-client.ts
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordAdminForm() {
  const searchParams = useSearchParams();

  // Récupération des infos de l'utilisateur ciblé depuis l'URL
  const userId = searchParams.get('id') ?? '';
  const userName = searchParams.get('name') ?? '';
  const userEmail = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!userId) {
      setError('Utilisateur invalide.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      // CORRECTION : Utilisez "setUserPassword" avec le paramètre "newPassword"
      const result = await authClient.admin.setUserPassword({
        userId: userId,
        newPassword: password, // <-- Le paramètre attendu est "newPassword"
      });

      if (result.error) {
        setError(
          result.error.message || 'Impossible de modifier le mot de passe.',
        );
        return;
      }

      setMessage('Mot de passe modifié avec succès.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto rounded-xl bg-white p-6 shadow space-y-5"
    >
      {/* UTILISATEUR CIBLE */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Utilisateur ciblé</p>
        <p className="font-semibold text-gray-900">{userName}</p>
        <p className="text-sm text-gray-600">{userEmail}</p>
      </div>

      {/* Nouveau mot de passe */}
      <div>
        <label className="font-semibold text-gray-700 block mb-1">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            className="border p-2 pr-10 w-full rounded text-black border-gray-300"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
            aria-label={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirmation */}
      <div>
        <label className="font-semibold text-gray-700 block mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            className="border p-2 pr-10 w-full rounded text-black border-gray-300"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
            aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-600">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !userId}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Modification...' : 'Modifier le mot de passe'}
      </button>
    </form>
  );
}
