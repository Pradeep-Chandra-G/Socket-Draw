// src/app/api/whiteboards/join/[roomCode]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { roomCode: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whiteboard = await prisma.whiteboard.findUnique({
      where: { roomCode: params.roomCode },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!whiteboard) {
      return NextResponse.json(
        { error: "Whiteboard not found" },
        { status: 404 }
      );
    }

    // Create permission for the user if they don't have one
    const existingPermission = whiteboard.permissions.find(
      (p) => p.userId === session.user.id
    );

    if (!existingPermission && whiteboard.ownerId !== session.user.id) {
      await prisma.whiteboardPermission.create({
        data: {
          whiteboardId: whiteboard.id,
          userId: session.user.id,
          permission: "EDIT",
        },
      });
    }

    return NextResponse.json({ whiteboard });
  } catch (error) {
    console.error("Error joining whiteboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
