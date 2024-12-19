import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ["query", "info", "warn", "error"] // Logs Prisma queries for debugging
	})

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function GET() {
	try {
		const tasks = await prisma.task.findMany()
		console.log("tasks", tasks)
		return NextResponse.json(tasks || [])
	} catch (error) {
		console.error("GET error:", error)
		return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json()
		if (!body || !body.title) {
			return NextResponse.json({ error: "Title is required" }, { status: 400 })
		}
		const newTask = await prisma.task.create({ data: { title: body.title } })
		return NextResponse.json(newTask, { status: 201 })
	} catch (error) {
		console.error("POST error:", error)
		return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json()
		if (!body || typeof body.id !== "number" || typeof body.completed !== "boolean") {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
		}
		const updatedTask = await prisma.task.update({
			where: { id: body.id },
			data: { completed: body.completed }
		})
		return NextResponse.json(updatedTask)
	} catch (error) {
		console.error("PUT error:", error)
		return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
	}
}

export async function DELETE(req: Request) {
	try {
		const body = await req.json()
		if (!body || typeof body.id !== "number") {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
		}
		await prisma.task.delete({ where: { id: body.id } })
		return NextResponse.json({ message: "Task deleted" }, { status: 204 })
	} catch (error) {
		console.error("DELETE error:", error)
		return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
	}
}
