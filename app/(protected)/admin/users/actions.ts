'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  niveau?: string;
  role?: string;
};

async function checkAdminSession() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!sessionData || sessionData.user.niveau !== 'GERANT') {
  //  throw new Error('Accès refusé. Vous devez être GERANT.');
  //}
  //if (!sessionData || sessionData.user.role !== 'ADMIN') {
  // throw new Error('Accès refusé. Vous devez être ADMIN.');
  //}
  if (
    !sessionData ||
    sessionData.user.niveau !== 'GERANT' //||     sessionData.user.role !== 'admin'
  ) {
    throw new Error('Accès refusé.');
  }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  await checkAdminSession();

  const client = await clientPromise;
  const db = client.db();

  const users = await db.collection('user').find({}).limit(100).toArray();

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    image: user.image,
    niveau: user.niveau,
    role: user.role,
  }));
}

export async function deleteAdminUser(userId: string) {
  await checkAdminSession();

  const client = await clientPromise;
  const db = client.db();

  const targetId = new ObjectId(userId);

  await db.collection('user').deleteOne({ _id: targetId });
  await db.collection('account').deleteMany({ userId: userId });
  await db.collection('session').deleteMany({ userId: userId });

  return { success: true };
}
