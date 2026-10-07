"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") {
      router.push("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, admin! You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
