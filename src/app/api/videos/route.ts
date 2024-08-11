import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        data: { videos },
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
        success: false,
      },
      {
        status: 500,
      }
    );
  } finally {
    prisma.$disconnect();
  }
}
