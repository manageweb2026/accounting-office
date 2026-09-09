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
  return niveau === 'AGENT' || niveau === 'SECRETAIRE' || niveau === 'GERANT';
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
  // CHARGEMENT VIA SERVER ACTION (BYPASSE LE 403)
  // ==========================================
  // ==========================================
  // CHARGEMENT VIA SERVER ACTION (BYPASSE LE 403)
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
          niveau: isUserNiveau(user.niveau) ? user.niveau : 'AGENT',
          role: user.role === 'admin' ? 'admin' : 'user',
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error('Erreur récupération utilisateurs :', err);
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
  // SUPPRIMER VIA SERVER ACTION
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
        err instanceof Error ? err.message : 'Erreur lors de la suppression.',
      );
    }
  };

  const handleEditClick = (user: UserType) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
    refreshList();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Utilisateurs
        </h1>

        {role === 'admin' && !isFormOpen && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(undefined);
              setIsFormOpen(true);
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Ajouter un Utilisateur
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {isFormOpen ? (
        <div className="mx-auto mb-6 max-w-xl">
          <UserForm
            initialData={editingUser}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <UserTable
          users={users}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
