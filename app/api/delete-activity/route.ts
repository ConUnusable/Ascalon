export const runtime = 'nodejs';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const delFolder = await prisma.activity.delete({
    where : {
        activityId: data.activityId 
    }
  });

  return new Response(JSON.stringify(data), { status: 201 });
}