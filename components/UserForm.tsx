'use client';
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { UserType, UserNiveau, UserRole } from '@/app/types/user';
import { Eye, EyeOff } from 'lucide-react';

interface UserFormProps {
  initialData?: UserType;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  imageFile: File | null;
  password: string;
  confirmPassword: string;
  niveau: UserNiveau;
  role: UserRole;
}

function isUserRole(role: unknown): role is UserRole {
  return role === 'user' || role === 'admin';
}

function isUserNiveau(niveau: unknown): niveau is UserNiveau {
  return niveau === 'AGENT' || niveau === 'SECRETAIRE' || niveau === 'GERANT';
}

function getInitialFormData(initialData?: UserType): FormState {
  return {
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    address: initialData?.address ?? '',
    image: initialData?.image ?? '',
    imageFile: null,

    password: '',
    confirmPassword: '',

    niveau: isUserNiveau(initialData?.niveau) ? initialData.niveau : 'AGENT',

    role: isUserRole(initialData?.role) ? initialData.role : 'user',
  };
}
export default function UserForm({
  initialData,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const { data: session } = useSession();

  const isAdmin = session?.user.role === 'admin';
  const [formData, setFormData] = useState<FormState>(() =>
    getInitialFormData(initialData),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isEditing = Boolean(initialData?._id);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError('La photo est trop lourde (maximum 5 Mo).');
      return;
    }

    const imageUrl = URL.createObjectURL(selectedFile);

    setFormData((prev) => ({
      ...prev,
      imageFile: selectedFile,
      image: imageUrl,
    }));

    setError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');

    // ============================
    // VALIDATION CRÉATION
    // ============================

    if (!isEditing) {
      if (!formData.password) {
        setError('Le mot de passe est obligatoire.');
        return;
      }

      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    setLoading(true);

    try {
      const userId = initialData?._id;

      const url = isEditing ? `/api/users/${userId}` : '/api/users';

      const method = isEditing ? 'PUT' : 'POST';

      /*
       * IMPORTANT :
       *
       * Pour la création :
       * password est envoyé à /api/users.
       *
       * /api/users appellera Better Auth.
       *
       * On NE crée PAS directement un document
       * MongoDB contenant password.
       */

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        image: formData.image,

        niveau: formData.niveau,
        role: formData.role,

        ...(isEditing
          ? {}
          : {
              password: formData.password,
            }),
      };

      const response = await fetch(url, {
        method,

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        let message = 'Une erreur est survenue.';

        if (typeof data === 'object' && data !== null) {
          if ('error' in data && typeof data.error === 'string') {
            message = data.error;
          } else if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          }
        }

        throw new Error(message);
      }

      onSuccess();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);

      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border bg-white p-6 shadow"
    >
      {/* TITRE */}

      <h3 className="text-xl font-bold text-gray-800">
        {isEditing ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
      </h3>

      {/* ERREUR */}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* PHOTO */}

      <div className="flex flex-col items-center gap-4">
        <Image
          src={formData.image || '/avatar.png'}
          alt="Photo profil"
          width={120}
          height={120}
          className="rounded-full border object-cover"
        />

        {/*
        Si tu veux réactiver la photo :

        <label
          htmlFor="image"
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Changer la photo

          <input
            id="image"
            type="file"
            accept="image/*"
            hidden
            disabled={loading}
            onChange={handleImageChange}
          />
        </label>
        */}
      </div>

      {/* NOM */}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nom
        </label>

        <input
          id="name"
          type="text"
          required
          disabled={loading}
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          className="mt-1 block w-full rounded-md border p-2 text-black"
          placeholder="Nom de l'utilisateur"
        />
      </div>

      {/* EMAIL */}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          required
          disabled={loading}
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          className="mt-1 block w-full rounded-md border p-2 text-black"
          placeholder="exemple@email.com"
        />
      </div>

      {/* MOT DE PASSE */}

      {!isEditing && (
        <>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                disabled={loading}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border p-2 text-black"
                placeholder="Minimum 8 caractères"
              />{' '}
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRMATION */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                disabled={loading}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border p-2 text-black"
                placeholder="Retapez le mot de passe"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
                aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* TELEPHONE */}

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Téléphone
        </label>

        <input
          id="phone"
          type="tel"
          disabled={loading}
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          className="mt-1 block w-full rounded-md border p-2 text-black"
          placeholder="0550 00 00 00"
        />
      </div>

      {/* ADRESSE */}

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Adresse
        </label>

        <input
          id="address"
          type="text"
          disabled={loading}
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          className="mt-1 block w-full rounded-md border p-2 text-black"
          placeholder="Adresse"
        />
      </div>

      {/* niveau */}

      <div>
        <label
          htmlFor="niveau"
          className="block text-sm font-medium text-gray-700"
        >
          Niveau
        </label>

        <select
          id="niveau"
          disabled={loading}
          value={formData.niveau}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              niveau: e.target.value as UserNiveau,
            }))
          }
          className="mt-1 block w-full rounded-md border p-2 text-black"
        >
          <option value="AGENT">Agent</option>
          <option value="SECRETAIRE">Secrétaire</option>
          <option value="GERANT">Gérant</option>
        </select>
      </div>

      {/* ROLE SYSTÈME */}

      {isAdmin && (
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rôle système
          </label>

          <select
            id="role"
            disabled={loading}
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                role: e.target.value as UserRole,
              }))
            }
            className="mt-1 block w-full rounded-md border p-2 text-black"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
      )}
      {/* CHANGEMENT MOT DE PASSE */}

      {isEditing && initialData?._id && isAdmin && (
        <div className="pt-2">
          <Link
            href={{
              pathname: '/change-password-admin',
              query: {
                id: initialData._id,
                name: initialData.name,
                email: initialData.email,
              },
            }}
            className="block text-center text-blue-600 hover:underline"
          >
            Changer le mot de passe
          </Link>
        </div>
      )}

      {/* BOUTONS */}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded border px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
