import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { clientPromise } from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          error: 'Accès réservé aux administrateurs',
        },
        { status: 403 },
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const users = await db
      .collection('user')
      .find({
        _id: {
          $ne: new ObjectId(session.user.id),
        },
      })
      .project({
        name: 1,
        email: 1,
        role: 1,
      })
      .sort({
        name: 1,
      })
      .toArray();

    return NextResponse.json({
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des utilisateurs',
      },
      {
        status: 500,
      },
    );
  }
}
