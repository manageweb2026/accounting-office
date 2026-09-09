import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
// ⚠️ CORRECTION : Ajouter 'type' ici pour éviter de charger le serveur côté client
import type { auth } from '@/lib/auth';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',

  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { useSession } = authClient;
