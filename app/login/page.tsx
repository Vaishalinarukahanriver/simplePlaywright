"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      localStorage.setItem("loggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username{" "}
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>
            Password{" "}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: 10 }}>
          Login
        </button>
      </form>
      <p style={{ color: "gray" }}>Hint: admin / admin</p>
    </div>
  );
}
