export const USER_NIVEAUX = ['AGENT', 'SECRETAIRE', 'GERANT'] as const;

export type UserNiveau = (typeof USER_NIVEAUX)[number];

export const USER_ROLES = ['user', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface UserType {
  _id?: string;

  name: string;

  email: string;

  phone?: string | null;

  address?: string | null;

  image?: string | null;

  niveau?: UserNiveau | null;

  role?: UserRole | null;

  // Utilisé uniquement lors de la création/modification
  // Ne doit pas être retourné par GET /api/users
  password?: string;
}
