export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();

    const user = await prisma.user.findUnique({
        where: { 
            email : data.email,
        },
    });

  return new Response(JSON.stringify(user), {status: 201} );
}
