"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        "/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      alert("Login successful");

      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);

      const message = axios.isAxiosError(error)
        ? error?.response?.data?.message
        : undefined;

      alert(message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
      >
        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold p-3 rounded-xl"
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}