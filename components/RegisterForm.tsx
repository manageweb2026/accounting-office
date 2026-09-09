'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
//import { Link } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [niveau, setNiveau] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        phone,
        image,
        niveau,
        address,
        //callbackURL: '/admin',
      });
      if (result.error) {
        console.log(result.error);
        setError(JSON.stringify(result.error));
        return;
      }

      setSuccess('Compte créé avec succès.');

      // Attendre un instant avant la redirection
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur inattendue est survenue.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    //<form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto" >
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-6"
    >
      {/* <h2 className="text-2xl font-bold text-center">Créer un compte</h2> */}
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="email"
          placeholder="Address e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <div className="w-full  rounded relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmer le mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="border p-2 pr-10 w-full"
          />

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={
              showPassword
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="w-full  rounded relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="border p-2 pr-10 w-full"
          />

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={
              showConfirmPassword
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input
          type="tel"
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          placeholder="Addresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded border p-2"
        />

        <select
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          required
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            Sélectionner un niveau
          </option>

          <option value="AGENT">Agent</option>

          <option value="SECRETAIRE">Secrétaire</option>

          <option value="GERANT">Gérant</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer un compte'}
        </button>
      </div>
    </form>
  );
}
