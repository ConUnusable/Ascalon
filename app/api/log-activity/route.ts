export const runtime = 'nodejs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day

  try {
    let activity = await prisma.activity.findFirst({
      where: {
        userId: data.UserId,
        activityDate: {
          gte: today,
        },
      },
    });

    if (activity) {
      let isActivity = await prisma.activity.findFirst({
        where: { activityId: activity.activityId }
      });
      if (isActivity) {
        const currentData = isActivity[data.activityType as keyof typeof isActivity] as string;
        if (currentData !== '') {
          await prisma.activity.update({
            where: { activityId: activity.activityId },
            data: {
              [data.activityType]: currentData + ', ' + data.activityData.toString(), // Ensure data.activityData is a string
            },
          });
        } else {
          await prisma.activity.update({
            where: { activityId: activity.activityId },
            data: {
              [data.activityType]: data.activityData.toString(), // Ensure data.activityData is a string
            }
          });
        }
      }
    } else {
      await prisma.activity.create({
        data: {
          userId: data.UserId,
          accessedFolders: data.activityType === 'accessedFolders' ? data.activityData.toString() : '',
          createdFolders: data.activityType === 'createdFolders' ? data.activityData.toString() : '',
          deletedFolders: data.activityType === 'deletedFolders' ? data.activityData.toString() : '',
          uploadedFiles: data.activityType === 'uploadedFiles' ? data.activityData.toString() : '',
          downloadedFiles: data.activityType === 'downloadedFiles' ? data.activityData.toString() : '',
          deletedFiles: data.activityType === 'deletedFiles' ? data.activityData.toString() : '',
        },
      });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error('Error logging activity:', error);
    return new Response(JSON.stringify({ error: 'Error logging activity' }), { status: 500 });
  }
}