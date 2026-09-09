'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu lorsqu'on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();

    router.push('/signin');
    router.refresh();
  };

  if (isPending) {
    return <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <Image
          src={session.user.image || '/avatar.png'}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full border-2 border-gray-300"
        />

        <span className="hidden md:block font-medium">{session.user.name}</span>

        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-xl border bg-white shadow-xl overflow-hidden">
          <div className="p-4 text-center border-b">
            <Image
              src={session.user.image || '/avatar.png'}
              alt="Avatar"
              width={70}
              height={70}
              className="rounded-full mx-auto mb-3"
            />

            <h3 className="font-semibold text-lg">{session.user.name}</h3>

            <p className="text-gray-500 text-sm">{session.user.email}</p>
            <p className="text-gray-500 text-sm">
              📞 {session.user.phone || 'Non renseigné'}
            </p>
            <span className="inline-block mt-2 rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {session.user.niveau}
            </span>
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              👤 Mon profil
            </Link>

            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              🏠 Dashboard
            </Link>
          </div>

          <div className="border-t p-2">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 py-2 text-white hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
