export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  
  const activity = await prisma.activity.findMany({
    where: {
      accessedFolders: {
        contains: data.folderId,
      },
    },
  });

  return new Response(JSON.stringify(activity), { status: 201 });
}