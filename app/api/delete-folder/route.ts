export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const delFolder = await prisma.folder.delete({
    where : {
        folderId : data.folderId 
    }
  });

  return new Response(JSON.stringify(data), { status: 201 });
}