export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  
  const folder = await prisma.user.findFirst({
    where: {
      email: data.email,
    }
  });

  return new Response(JSON.stringify(folder), {status: 201} );
}
