export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const newFile = await prisma.file.create({
    data: {
      fileName: data.fileName,
      folderId: data.folderId,
      fileData: Buffer.from(data.fileData),
      fileSize: data.fileSize,
    },
  });

  return new Response(JSON.stringify({ ...data, fileId: newFile.fileId }), {status: 201} );
}
