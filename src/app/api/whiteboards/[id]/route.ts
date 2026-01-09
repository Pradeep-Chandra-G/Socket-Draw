// src/app/api/whiteboards/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id: params.id },
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

    const hasAccess =
      whiteboard.ownerId === session.user.id ||
      whiteboard.permissions.some((p) => p.userId === session.user.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse elements if they're stored as JSON string
    let elements = whiteboard.elements;
    if (typeof elements === "string") {
      try {
        elements = JSON.parse(elements);
      } catch (e) {
        elements = [];
      }
    }

    return NextResponse.json({
      whiteboard: {
        ...whiteboard,
        elements: Array.isArray(elements) ? elements : [],
      },
    });
  } catch (error) {
    console.error("Error fetching whiteboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, elements, thumbnail } = await req.json();

    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id: params.id },
      include: {
        permissions: true,
      },
    });

    if (!whiteboard) {
      return NextResponse.json(
        { error: "Whiteboard not found" },
        { status: 404 }
      );
    }

    const hasEditAccess =
      whiteboard.ownerId === session.user.id ||
      whiteboard.permissions.some(
        (p) => p.userId === session.user.id && p.permission === "EDIT"
      );

    if (!hasEditAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedWhiteboard = await prisma.whiteboard.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(elements !== undefined && { elements: elements }),
        ...(thumbnail !== undefined && { thumbnail }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ whiteboard: updatedWhiteboard });
  } catch (error) {
    console.error("Error updating whiteboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id: params.id },
    });

    if (!whiteboard) {
      return NextResponse.json(
        { error: "Whiteboard not found" },
        { status: 404 }
      );
    }

    if (whiteboard.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.whiteboard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting whiteboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
