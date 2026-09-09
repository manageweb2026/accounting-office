import mongoose, { Schema, Model } from 'mongoose';

export type UserNiveau = 'AGENT' | 'SECRETAIRE' | 'GERANT';
export type UserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  image?: string;

  phone?: string;
  address: string;

  niveau?: UserNiveau;
  role?: UserRole;

  isActive?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
      default: '',
    },

    phone: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    niveau: {
      type: String,
      enum: ['AGENT', 'SECRETAIRE', 'GERANT'],
      default: 'AGENT',
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
