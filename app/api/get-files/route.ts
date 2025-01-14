export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  
  const file = await prisma.file.findMany({
    where: {
      folderId: data.folderId,
    }
  });

  return new Response(JSON.stringify(file), {status: 201} );
}
