import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protection de la page
  if (!session) {
    redirect('/signin');
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

        <ProfileForm
          user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            phone: session.user.phone ?? '',
            address: session.user.address ?? '',
            role: session.user.role ?? '',
          }}
        />
      </div>
    </main>
  );
}
