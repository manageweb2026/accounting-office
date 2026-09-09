import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

async function migrate() {
  console.log('MONGODB_URI chargée :', Boolean(process.env.MONGODB_URI));

  if (!process.env.MONGODB_URI) {
    throw new Error(
      'MONGODB_URI est introuvable. Vérifie D:\\auth-app\\.env.local',
    );
  }

  // Import après le chargement de .env.local
  const { clientPromise } = await import('@/lib/mongodb');

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('user').updateMany(
    {
      niveau: { $exists: false },
    },
    {
      $set: {
        niveau: 'AGENT',
      },
    },
  );

  console.log(`Utilisateurs modifiés : ${result.modifiedCount}`);

  await client.close();

  console.log('Migration terminée.');
}

migrate().catch((error) => {
  console.error('Erreur migration :', error);
  process.exit(1);
});
