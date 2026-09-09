'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/google-callback',
      });
      console.log('GOOGLE RESULT:', result);
      if (result.error) {
        console.error(result.error.message);
        alert(result.error.message);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : 'Une erreur est survenue.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
    >
      {loading ? (
        'Connexion...'
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20"
            height="20"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.7-5.3l-6.3-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.5 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.3 7.2l6.3 5.2C39.1 36.9 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
            />
          </svg>
          Continuer avec Google
        </>
      )}
    </button>
  );
}
