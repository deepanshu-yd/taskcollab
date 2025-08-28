"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  // Fetch tasks
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/tasks")
        .then(res => res.json())
        .then(data => setTasks(data));
    }
  }, [status]);

  // Create new task
  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setTitle("");
  }

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    return (
      <div>
        <p>You must sign in to access your dashboard.</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>

      {/* Add Task Form */}
      <form onSubmit={createTask} className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-3 border rounded flex justify-between"
          >
            <span>{task.title}</span>
            <span className="text-sm text-gray-500">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
