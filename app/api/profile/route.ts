import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { clientPromise } from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';
// GET : récupérer le profil
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    return NextResponse.json({
      user: session.user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      },
    );
  }
}

// PUT : modifier le profil
// PUT : modifier le profil
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const formData = await request.formData();

    // Extraction et conversion explicite en chaîne de caractères pour MongoDB
    const phone = formData.get('phone')?.toString() || '';
    const address = formData.get('address')?.toString() || '';
    const image = formData.get('image');

    const client = await clientPromise;
    const db = client.db();

    // On initialise avec la valeur actuelle de la session
    let imageUrl = session.user.image;

    // CORRECTION : Vérification stricte du fichier binaire avant l'envoi à Cloudinary
    if (
      image &&
      typeof image !== 'string' &&
      'size' in image &&
      image.size > 0
    ) {
      imageUrl = await uploadImage(image as File);
    }

    // Mise à jour sécurisée dans MongoDB
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          phone,
          address,
          image: imageUrl, // Sera soit la nouvelle URL Cloudinary, soit l'ancienne si aucune photo n'a été prise
        },
      },
    );

    console.log(
      `Documents trouvés: ${result.matchedCount}, Modifiés: ${result.modifiedCount}`,
    );

    // Récupération de l'utilisateur mis à jour
    const updatedUser = await db.collection('user').findOne({
      _id: new ObjectId(session.user.id),
    });

    return NextResponse.json({
      message: 'Profil modifié avec succès',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erreur PUT profile:', error);
    return NextResponse.json(
      { message: 'Erreur serveur lors de la mise à jour' },
      { status: 500 },
    );
  }
}
