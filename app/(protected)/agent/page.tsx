import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';

export default async function AgentPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si l'utilisateur n'est pas connecté
  if (!session || session?.user.niveau !== 'AGENT') {
    redirect('/signin');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Agent-SESSION</h1>

        <p className="mt-4 text-gray-600">
          Bienvenue <span className="font-semibold">{session.user.name}</span>
        </p>
        <nav>
          <>
            <a href="/admin/users">Utilisateurs</a>

            <a href="/admin/settings">Paramètres</a>
          </>
        </nav>
        <div className="mt-6 space-y-2">
          <p>
            Email : <span className="font-medium">{session.user.email}</span>
          </p>

          <p>
            ID utilisateur :{' '}
            <span className="font-medium">{session.user.id}</span>
          </p>
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
