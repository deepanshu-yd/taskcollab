"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome, {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      <img
        src={session.user?.image || ""}
        alt="User Avatar"
        className="rounded-full w-16 h-16 mt-4"
      />

      <button
        onClick={() => signOut()}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign out
      </button>
    </div>
  );
}
