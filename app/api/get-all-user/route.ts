export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
import { root } from "postcss";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  // Fetch users based on the email filter
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: data.email,
      },
    },
  });

  // For each user, fetch folder names
  const usersWithFolderNames = await Promise.all(
    users.map(async (user) => {
      const folderIds = user.rootFolderAccess
        .split(',')
        .map((id) => id.toString());

      const folders = await prisma.folder.findMany({
        where: {
          folderId: { in: folderIds },
        },
        select: {
          folder: true,
        },
      });

      const folderNames = folders.map((folder) => folder.folder);
      return {
        ...user,
        folderNames,
      };
    })
  );

  return new Response(JSON.stringify(usersWithFolderNames), { status: 201 });
}