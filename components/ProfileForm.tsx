'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  address?: string;
  role?: string;
}

interface ProfileFormProps {
  user: UserProfile;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [image, setImage] = useState<string>(user.image || '/avatar.png');

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');

  // Aperçu de la nouvelle photo
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Sécurité : Vérifie le format image
    if (!selectedFile.type.startsWith('image/')) {
      alert('Veuillez sélectionner ou prendre une photo au format image.');
      return;
    }

    // Sécurité : Limite à 5 Mo
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert('La photo est trop lourde (maximum 5 Mo).');
      return;
    }

    // CORRECTION : Nettoie uniquement si c'est un ancien aperçu blob temporaire
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }

    setFile(selectedFile);

    // Crée la nouvelle URL d'aperçu
    const imageUrl = URL.createObjectURL(selectedFile);
    setImage(imageUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      formData.append('phone', phone);
      formData.append('address', address);

      // L'image (qu'elle vienne de la caméra ou du stockage) est envoyée ici
      if (file) {
        formData.append('image', file);
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formData, // Le navigateur gère le Content-Type automatiquement
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour.');
      }

      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Erreur de modification du profil');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-6"
    >
      {/* Photo */}
      <div className="flex flex-col items-center gap-4">
        <Image
          src={image}
          alt="Photo profil"
          width={120}
          height={120}
          className="rounded-full border object-cover"
        />

        <label
          className="
          cursor-pointer
          rounded-lg
          bg-blue-600
          px-4
          py-2
          text-white
          "
        >
          Changer la photo
          <input
            type="file"
            accept="image/*"
            capture="user" // Force l'ouverture de la caméra frontale sur mobile
            hidden
            onChange={handleImageChange}
          />
        </label>
      </div>
      {/* Nom */}
      <div>
        <label className="font-semibold">Nom</label>

        <input
          value={user.name}
          disabled
          className="
          mt-1
          w-full
          rounded
          border
          bg-gray-100
          p-2
          "
        />
      </div>
      {/* Email */}
      <div>
        <label className="font-semibold">Email</label>

        <input
          value={user.email}
          disabled
          className="
          mt-1
          w-full
          rounded
          border
          bg-gray-100
          p-2
          "
        />
      </div>
      {/* Téléphone */}
      <div>
        <label className="font-semibold">Téléphone</label>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          //placeholder="0000000000"
          className="
          mt-1
          w-full
          rounded
          border
          p-2
          "
        />
      </div>{' '}
      {/* address */}
      <div>
        <label className="font-semibold">Adresse</label>

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adresse"
          className="
          mt-1
          w-full
          rounded
          border
          p-2
          "
        />
      </div>
      {/* Niveau */}
      <div>
        <label className="font-semibold">Role</label>

        <input
          value={user.role || ''}
          disabled
          className="
          mt-1
          w-full
          rounded
          border
          bg-gray-100
          p-2
          "
        />
      </div>
      <Link
        href="/change-password"
        className="block text-center text-blue-600 hover:underline"
      >
        Changer mon mot de passe
      </Link>
      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="
        w-full
        rounded-lg
        bg-green-600
        px-4
        py-2
        text-white
        disabled:opacity-50
        "
      >
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
      {message && <p className="text-center">{message}</p>}
    </form>
  );
}
