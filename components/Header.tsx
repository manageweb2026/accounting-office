'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { useSession } from '@/lib/auth-client';

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const niveau = session?.user.niveau;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* ========================= */}
        {/* NAVIGATION DESKTOP */}
        {/* ========================= */}

        <nav className="hidden md:flex items-center gap-6">
          {/* GERANT */}
          {niveau === 'GERANT' && (
            <>
              <Link
                href="/admin/activity"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>

              <Link
                href="/admin/profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Profil
              </Link>

              <Link
                href="/admin/users"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Utilisateurs
              </Link>

                <Link
                href="/admin/clients"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                clients
              </Link>

                <Link
                href="/admin/services"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                services
              </Link>


                <Link
                href="/admin/paymentM"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                les methodes de paiement
              </Link>

                <Link
                href="/admin/reports"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                rapport
              </Link>

              
            </>
          )}

          {/* SECRETAIRE */}
          {niveau === 'SECRETAIRE' && (
            <>
             

              <Link
                href="/secretaire/profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Profil
              </Link>

               <Link
                href="/secretaire/tasks"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Tâches
              </Link>

               <Link
                href="/secretaire/clients"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Clients
              </Link>
            </>
          )}

          {/* AGENT */}
          {niveau === 'AGENT' && (
            <>
              <Link
                href="/employee/tasks"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Taches
              </Link>

               <Link
                href="/employee/my_tasks"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Mes taches
              </Link>

              
                             <Link
                href="/employee/report"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Rapport
              </Link>


              <Link
                href="/employee/profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Profil
              </Link>
            </>
          )}
        </nav>

        {/* ========================= */}
        {/* DROITE */}
        {/* ========================= */}

        <div className="flex items-center gap-3">
          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              // X
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              // ☰
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>

          <UserMenu />
        </div>
      </div>

      {/* ========================= */}
      {/* MENU MOBILE */}
      {/* ========================= */}

      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <nav className="flex flex-col p-4 space-y-1">
            {/* GERANT */}
            {niveau === 'GERANT' && (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  📊 Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  👤 Profil
                </Link>

                <Link
                  href="/users"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  👥 Utilisateurs
                </Link>
              </>
            )}

            {/* SECRETAIRE */}
            {niveau === 'SECRETAIRE' && (
              <>
               

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  👤 Profil
                </Link>

                 <Link
                  href="/secretaire/tasks"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  📋 Tâches
                </Link>


                  <Link
                href="/secretaire/clients"
                 onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Clients
              </Link>
              </>
            )}

            {/* AGENT */}
            {niveau === 'AGENT' && (
              <>
                <Link
                  href="/travaux"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  🔧 Travaux
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  👤 Profil
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
