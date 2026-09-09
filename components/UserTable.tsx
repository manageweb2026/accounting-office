'use client';

import { UserType } from '@/app/types/user';

interface UserTableProps {
  users: UserType[];
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Nom
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Téléphone
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Niveau
            </th>

            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white text-black">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {/* Nom */}
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {user.name}
                </td>

                {/* Email */}
                <td className="whitespace-nowrap px-6 py-4">{user.email}</td>

                {/* Téléphone */}
                <td className="whitespace-nowrap px-6 py-4">
                  {user.phone || '-'}
                </td>

                {/* Rôle */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.niveau === 'GERANT'
                        ? 'bg-red-100 text-red-800'
                        : user.niveau === 'SECRETAIRE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.niveau || 'AGENT'}
                  </span>
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (user._id) {
                          onDelete(user._id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
