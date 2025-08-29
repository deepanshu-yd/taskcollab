"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // 🔒 Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // redirect to home page which has the sign in button
    }
  }, [status, router]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    };
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  // Create new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });

    if (res.ok) {
      const task = await res.json();
      setTasks((prev) => [...prev, task]);
      setNewTask("");
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Welcome, {session?.user?.name}
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-gray-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <input
              type="text"
              value={task.title}
              onChange={(e) => {
                const updatedTitle = e.target.value;
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === task.id ? { ...t, title: updatedTitle } : t
                  )
                );
              }}
              onBlur={async () => {
                await fetch(`/api/tasks/${task.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title: task.title }),
                });
              }}
              className="flex-1 border rounded px-2 py-1 mr-2"
            />
            <button
              onClick={() => handleDelete(task.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
