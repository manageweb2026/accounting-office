import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (session.user.niveau !== 'GERANT') {
      return NextResponse.json(
        { error: 'Accès réservé aux GERANT' },
        { status: 403 },
      );
    }

    const body = await req.json();

    const { name, email, phone, address, image, password, niveau } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: 'Nom, email et mot de passe requis',
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: 'Le mot de passe doit contenir au moins 8 caractères',
        },
        { status: 400 },
      );
    }

    const result = await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role: 'user',

        data: {
          niveau: niveau || 'AGENT',
          phone: phone || '',
          address: address || '',
          image: image || '',
        },
      },

      headers: await headers(),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/users:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 },
    );
  }
}
