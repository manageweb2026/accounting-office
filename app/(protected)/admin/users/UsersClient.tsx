'use client';

import { useEffect, useState } from 'react';

import {
  getAdminUsers,
  deleteAdminUser,
} from '@/app/(protected)/users/actions';

import UserTable from '@/components/UserTable';
import UserForm from '@/components/UserForm';

import type { UserType, UserNiveau } from '@/app/types/user';

function isUserNiveau(niveau: unknown): niveau is UserNiveau {
  return (
    niveau === 'AGENT' ||
    niveau === 'SECRETAIRE' ||
    niveau === 'GERANT'
  );
}

interface UsersClientProps {
  role: string;
}

export default function UsersClient({ role }: UsersClientProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | undefined>(
    undefined,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');

  // ==========================================
  // CHARGEMENT DES UTILISATEURS
  // ==========================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError('');

        const usersList = await getAdminUsers();

        const formattedUsers: UserType[] = usersList.map((user) => ({
          _id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? '',
          phone: user.phone ?? '',
          address: user.address ?? '',
          niveau: isUserNiveau(user.niveau)
            ? user.niveau
            : 'AGENT',
          role: user.role === 'admin' ? 'admin' : 'user',
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error(
          'Erreur récupération utilisateurs :',
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger la liste.',
        );
      }
    };

    fetchUsers();
  }, [refreshKey]);

  // ==========================================
  // RAFRAÎCHIR LA LISTE
  // ==========================================

  const refreshList = () => {
    setRefreshKey((previous) => previous + 1);
  };

  // ==========================================
  // OUVRIR FORMULAIRE AJOUT
  // ==========================================

  const handleAddClick = () => {
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  // ==========================================
  // OUVRIR FORMULAIRE MODIFICATION
  // ==========================================

  const handleEditClick = (user: UserType) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // ==========================================
  // SUPPRIMER UTILISATEUR
  // ==========================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer cet utilisateur ?',
    );

    if (!confirmed) return;

    try {
      await deleteAdminUser(id);
      refreshList();
    } catch (err) {
      console.error('Erreur suppression :', err);

      alert(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la suppression.',
      );
    }
  };

  // ==========================================
  // SUCCÈS FORMULAIRE
  // ==========================================

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
    refreshList();
  };

  // ==========================================
  // ANNULER / FERMER
  // ==========================================

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Utilisateurs
        </h1>

        {role === 'admin' && (
          <button
            type="button"
            onClick={handleAddClick}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Ajouter un Utilisateur
          </button>
        )}

      </div>

      {/* ==========================================
          ERREUR
      ========================================== */}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ==========================================
          TABLEAU UTILISATEURS
      ========================================== */}

      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* ==========================================
          MODAL AJOUT / MODIFICATION
      ========================================== */}

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleFormCancel();
            }
          }}
        >

          {/* ==========================================
              FENÊTRE FORMULAIRE
          ========================================== */}

          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >

            {/* BOUTON FERMER */}

            <button
              type="button"
              onClick={handleFormCancel}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Fermer"
            >
              ×
            </button>

            {/* TITRE */}

            <div className="mb-6 pr-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingUser
                  ? 'Modifier l’utilisateur'
                  : 'Ajouter un utilisateur'}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingUser
                  ? 'Modifiez les informations de l’utilisateur.'
                  : 'Remplissez les informations du nouvel utilisateur.'}
              </p>
            </div>

            {/* FORMULAIRE */}

            <UserForm
              initialData={editingUser}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />

          </div>
        </div>
      )}

    </div>
  );
}