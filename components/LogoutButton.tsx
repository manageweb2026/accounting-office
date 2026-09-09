'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        alert(result.error.message);
        return;
      }

      // Redirection vers la page de connexion
      router.push('/signin');
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la déconnexion.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? 'Déconnexion...' : 'Se déconnecter'}
    </button>
  );
}
