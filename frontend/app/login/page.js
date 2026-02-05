"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setAuthToken } from "../../lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const loginRes = await api.login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      if (loginRes?.token) {
        setAuthToken(loginRes.token);
      }

      router.push("/notes");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!registerForm.email.trim() || !registerForm.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await api.register({
        email: registerForm.email.trim(),
        password: registerForm.password,
        name: registerForm.name.trim() || undefined,
      });

      const loginRes = await api.login({
        email: registerForm.email.trim(),
        password: registerForm.password,
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
        </div>
      </nav>

      {/* Auth Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Login Card */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`text-lg font-semibold ${
                  mode === "login"
                    ? "text-[#4F46E5] border-b-2 border-[#4F46E5] pb-2"
                    : "text-[#6B7280]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`text-lg font-semibold ${
                  mode === "register"
                    ? "text-[#4F46E5] border-b-2 border-[#4F46E5] pb-2"
                    : "text-[#6B7280]"
                }`}
              >
                Register
              </button>
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-2xl font-bold text-[#111827]">Login</h2>
                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-[#EF4444]">
                    {error}
                  </p>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#111827]">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#111827] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((f) => ({ ...f, email: e.target.value }))
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
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="Enter your password"
                    required
                  />
                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-sm text-[#4F46E5] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#4F46E5] px-4 py-3 text-base font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60 transition"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
                <p className="text-center text-sm text-[#6B7280]">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-[#4F46E5] hover:underline"
                  >
                    Register
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
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
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, name: e.target.value }))
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
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, email: e.target.value }))
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
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        password: e.target.value,
                      }))
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
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-[#4F46E5] hover:underline"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Register Card - Side by side */}
          <div className="hidden lg:block rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`text-lg font-semibold ${
                  mode === "register"
                    ? "text-[#4F46E5] border-b-2 border-[#4F46E5] pb-2"
                    : "text-[#6B7280]"
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`text-lg font-semibold ${
                  mode === "login"
                    ? "text-[#4F46E5] border-b-2 border-[#4F46E5] pb-2"
                    : "text-[#6B7280]"
                }`}
              >
                Login
              </button>
            </div>
            {mode === "register" ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-[#111827]">
                  Create Account
                </h2>
                <p className="text-[#6B7280]">
                  Join thousands of users organizing their notes and bookmarks
                  efficiently.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-[#111827]">
                  Welcome Back
                </h2>
                <p className="text-[#6B7280]">
                  Sign in to access your personal notes and bookmarks.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
