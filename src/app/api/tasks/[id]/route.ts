import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PATCH /api/tasks/:id → toggle complete or update
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, completed } = body;

    // Validate input
    if (title !== undefined && (typeof title !== 'string' || title.length > 500)) {
      return NextResponse.json(
        { error: "Title must be a string and less than 500 characters" },
        { status: 400 }
      );
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: "Completed must be a boolean" },
        { status: 400 }
      );
    }

    // First, check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email }
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(completed !== undefined && { completed }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email }
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.task.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
