"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    const response = await fetch("/api/login", {
      method: "POST",
        credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

   if (!data.success) {
  setMessage(data.message);
  return;
}

alert(JSON.stringify(data));


if (data.role === "admin") {
  router.push("/admin");
} else if (data.role === "secretary") {
 router.push("/secretary");
} else {
 router.push("/employee");
}
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 350,
          background: "#fff",
          padding: 25,
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,.15)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          تسجيل الدخول
        </h2>

        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          دخول
        </button>

        {message && (
          <p
            style={{
              color: "red",
              marginTop: 15,
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}