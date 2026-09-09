import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/mongodb';

const COLLECTION_NAME = 'user';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log('ID reçu:', id);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID utilisateur invalide' },
        { status: 400 },
      );
    }

    const body = await req.json();

    console.log('BODY reçu:', body);

    const client = await clientPromise;
    const db = client.db();

    const objectId = new ObjectId(id);

    // Vérifier que l'utilisateur existe
    const userBefore = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: objectId });

    console.log('USER AVANT:', userBefore);

    if (!userBefore) {
      return NextResponse.json(
        { message: 'Utilisateur introuvable' },
        { status: 404 },
      );
    }

    // Données à modifier
    const updateData: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      image?: string;
      niveau?: string;
      role?: string;
      password?: string;
    } = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      address: body.address || '',
      image: body.image || '',
      niveau: body.niveau || 'AGENT',
      role: body.role || 'user',
    };

    // Ne modifier le mot de passe que s'il est fourni
    if (typeof body.password === 'string' && body.password.trim() !== '') {
      updateData.password = body.password;
    }

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { _id: objectId },
      {
        $set: updateData,
      },
      {
        returnDocument: 'after',
      },
    );

    console.log('USER APRÈS:', result);

    if (!result) {
      return NextResponse.json(
        { message: 'Utilisateur introuvable après modification' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ...result,
      _id: result._id.toString(),
    });
  } catch (error) {
    console.error('================================');
    console.error('ERREUR PUT USER');
    console.error(error);
    console.error('================================');

    return NextResponse.json(
      {
        message: 'Erreur serveur lors de la modification',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID utilisateur invalide' },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Utilisateur introuvable' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'Utilisateur supprimé',
    });
  } catch (error) {
    console.error('DELETE /api/users/[id]:', error);

    return NextResponse.json(
      {
        message: 'Erreur serveur lors de la suppression',
      },
      { status: 500 },
    );
  }
}
