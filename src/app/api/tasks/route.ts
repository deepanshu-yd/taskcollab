import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET → list tasks
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const tasks = await prisma.task.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(tasks)
}

// POST → create new task
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const body = await req.json()
  const task = await prisma.task.create({
    data: {
      title: body.title,
      status: "todo",
      user: { connect: { email: session.user.email } },
    },
  })
  return NextResponse.json(task)
}
