export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        surname: data.surname,
        accessLevel: data.accessLevel,
        rootFolderAccess: data.rootFolderAccess,
      },
    });

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return new Response(JSON.stringify({ error: 'Error adding user' }), { status: 500 });
  }
}