"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setAuthToken } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await api.register({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim() || undefined,
      });

      const loginRes = await api.login({
        email: form.email.trim(),
        password: form.password,
      });

      if (loginRes?.token) {
        setAuthToken(loginRes.token);
      }

      router.push("/notes");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar */}
      <nav className="bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F46E5]">
              <span className="text-lg">📝</span>
            </div>
            <h1 className="text-lg font-semibold text-[#111827]">
              Personal Notes &amp; Bookmark Manager
            </h1>
          </div>
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#4F46E5] hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Auth Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Register Card */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4">
              <Link
                href="/login"
                className="text-lg font-semibold text-[#6B7280] hover:text-[#4F46E5]"
              >
                Login
              </Link>
              <span className="text-lg font-semibold text-[#4F46E5] border-b-2 border-[#4F46E5] pb-2">
                Register
              </span>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-[#111827]">Register</h2>
              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-[#EF4444]">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827]">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#111827] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827]">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#111827] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827]">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#111827] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#4F46E5] px-4 py-3 text-base font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60 transition"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
              <p className="text-center text-sm text-[#6B7280]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Info Card */}
          <div className="hidden lg:block rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-[#111827]">
              Create Account
            </h2>
            <p className="text-[#6B7280]">
              Join thousands of users organizing their notes and bookmarks
              efficiently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
