"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Create new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    if (newTask.length > 500) {
      setError("Task title must be less than 500 characters");
      return;
    }

    setIsAddingTask(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks((prev) => [data, ...prev]);
        setNewTask("");
      } else {
        setError(data.error || "Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsAddingTask(false);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Network error. Please check your connection.");
    }
  };

  // Toggle completed
  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, completed } : task
          )
        );
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Network error. Please check your connection.");
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">TaskCollab</h1>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Welcome back,</span>
                <span className="font-medium text-gray-700">{session?.user?.name}</span>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-800">{totalTasks}</p>
                <p className="text-gray-600">Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-800">{completedTasks}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-800">{totalTasks - completedTasks}</p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
                if (error) setError(""); // Clear error when typing
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={isAddingTask || !newTask.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              {isAddingTask ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Task"
              )}
            </button>
          </form>
          
          {/* Character count */}
          <div className="mt-2 text-xs text-gray-500 text-right">
            {newTask.length}/500 characters
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Your Tasks</h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Create your first task to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => handleToggleComplete(task.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`text-gray-800 ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </span>
                      {task.completed && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
