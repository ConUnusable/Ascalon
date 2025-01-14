export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  
  const folder = await prisma.folder.findMany({
    where: {
      parentId: data.folderId,
    }
  });

  return new Response(JSON.stringify(folder), {status: 201} );
}
