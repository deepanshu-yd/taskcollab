"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div>
      <p>Welcome to TaskCollab</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
