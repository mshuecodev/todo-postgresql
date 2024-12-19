"use client"
import React, { useState, useEffect } from "react"

type Todo = {
	id: number
	title: string
	description?: string
	completed: boolean
}

const TodoList: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([])
	const [newTodo, setNewTodo] = useState({ title: "", description: "" })

	const fetchTodos = async () => {
		try {
			const response = await fetch("/api/tasks")
			if (!response.ok) throw new Error("Failed to fetch tasks")
			const data = await response.json()
			setTodos(data)
		} catch (error) {
			console.error("Error fetching tasks:", error)
		}
	}

	const addTodo = async () => {
		console.log("post here", newTodo)
		await fetch("/api/tasks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newTodo)
		})

		fetchTodos()
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setNewTodo((prev) => ({ ...prev, [name]: value }))
	}

	const toggleCompletion = async (id: number, completed: boolean) => {
		await fetch("/api/tasks", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, completed: !completed })
		})
		fetchTodos()
	}

	const deleteTask = async (id: number) => {
		await fetch("/api/tasks", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		})
		fetchTodos()
	}

	useEffect(() => {
		fetchTodos()
	}, [])

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-2xl mx-auto bg-gray-100 shadow-md rounded-lg p-6">
				<h1 className="text-2xl font-semibold text-gray-800 mb-4">Todo List</h1>

				{/* Add Todo Form */}
				<div className="mb-6">
					<input
						type="text"
						name="title"
						placeholder="Title"
						value={newTodo.title}
						onChange={handleInputChange}
						className="w-full px-4 py-2 mb-2 border border-gray-200 rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
					/>
					<textarea
						name="description"
						placeholder="Description (optional)"
						value={newTodo.description}
						onChange={handleInputChange}
						className="w-full px-4 py-2 mb-4 border border-gray-200 rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
					></textarea>
					<button
						onClick={addTodo}
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
					>
						Add Todo
					</button>
				</div>

				{/* Todo List */}
				<ul className="space-y-4">
					{todos.map((todo) => (
						<li
							key={todo.id}
							className="flex justify-between items-center bg-gray-200 p-4 border rounded-lg shadow-sm"
						>
							<div>
								<h3 className={`text-lg font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{todo.title}</h3>
								<p className="text-sm text-gray-600">{todo.description}</p>
							</div>
							<div className="flex gap-2">
								<button
									className={`px-4 py-2 text-sm rounded ${todo.completed ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
									onClick={() => toggleCompletion(todo.id, todo.completed)}
								>
									{todo.completed ? "Completed" : "Mark Complete"}
								</button>
								<button
									className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
									onClick={() => deleteTask(todo.id)}
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default TodoList
