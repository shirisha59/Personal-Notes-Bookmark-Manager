import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar */}
      <nav className="bg-[#4F46E5] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <span className="text-lg">📝</span>
            </div>
            <h1 className="text-lg font-semibold text-white">
              Personal Notes &amp; Bookmark Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#4F46E5] hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#4F46E5] hover:bg-gray-100"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold tracking-tight text-[#111827]">
              Organize Your Notes &amp; Bookmarks
            </h2>
            <p className="text-lg text-[#6B7280]">
              Manage your personal notes and website bookmarks in one simple and
              flexible app. Keep everything organized, searchable, and accessible
              from anywhere.
            </p>
            <Link
              href="/notes"
              className="inline-block rounded-lg bg-[#4F46E5] px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-[#4338CA] transition"
            >
              Get Started
            </Link>
          </div>
          <div className="flex items-center justify-center">
            {/* Simple preview illustration of the app */}
            <div className="relative h-72 w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl">
              {/* Top bar */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
                </div>
                <div className="flex gap-2 text-[11px]">
                  <span className="rounded-full bg-[#4F46E5] px-3 py-1 font-medium text-white">
                    Notes
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[#6B7280]">
                    Bookmarks
                  </span>
                </div>
              </div>
              {/* Fake search bar */}
              <div className="mb-3 h-7 w-full rounded-lg bg-gray-100 px-3 py-1 text-[11px] text-[#6B7280]">
                🔍 Search notes...
              </div>
              {/* Mini cards grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-gray-200 bg-white p-2">
                  <p className="mb-1 font-semibold text-[#111827]">
                    Project ideas
                  </p>
                  <p className="mb-2 line-clamp-2 text-[#6B7280]">
                    Next.js dashboard layout and bookmark manager UI concepts.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 text-[10px] text-[#14B8A6]">
                      ideas
                    </span>
                    <span className="rounded-full bg-[#4F46E5]/10 px-2 py-0.5 text-[10px] text-[#4F46E5]">
                      notes
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-2">
                  <p className="mb-1 font-semibold text-[#111827]">
                    React resources
                  </p>
                  <p className="mb-2 line-clamp-2 text-[#6B7280]">
                    Useful articles and docs for React and Tailwind CSS.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 text-[10px] text-[#14B8A6]">
                      react
                    </span>
                    <span className="rounded-full bg-[#4F46E5]/10 px-2 py-0.5 text-[10px] text-[#4F46E5]">
                      bookmarks
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-2">
                  <p className="mb-1 font-semibold text-[#111827]">
                    Exam revision
                  </p>
                  <p className="mb-2 line-clamp-2 text-[#6B7280]">
                    DBMS, OS, and networking quick notes for last-minute review.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 text-[10px] text-[#14B8A6]">
                      exam
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-2">
                  <p className="mb-1 font-semibold text-[#111827]">
                    Favorite links
                  </p>
                  <p className="mb-2 line-clamp-2 text-[#6B7280]">
                    React docs, Tailwind docs, MDN, and roadmap resources.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded-full bg-[#14B8A6]/10 px-2 py-0.5 text-[10px] text-[#14B8A6]">
                      web
                    </span>
                    <span className="rounded-full bg-[#4F46E5]/10 px-2 py-0.5 text-[10px] text-[#4F46E5]">
                      saved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature Card 1 */}
          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5]/10">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#111827]">
              Manage Personal Notes
            </h3>
            <p className="mb-4 text-sm text-[#6B7280]">
              Keep track of your personal notes, ideas, and tasks. Organize them
              with tags and search instantly.
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#14B8A6]">
                Notes
              </span>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#14B8A6]/10">
              <span className="text-2xl">🔖</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#111827]">
              Organize Bookmarks
            </h3>
            <p className="mb-4 text-sm text-[#6B7280]">
              Save and tag your favorite websites and articles. Access them
              quickly with smart search and filters.
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#14B8A6]">
                react
              </span>
              <span className="rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#14B8A6]">
                tailwind
              </span>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5]/10">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#111827]">
              Quick Search &amp; Filter
            </h3>
            <p className="mb-4 text-sm text-[#6B7280]">
              Find your saved notes and bookmarks instantly. Filter by tags and
              search across all your content.
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#14B8A6]">
                search
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[#6B7280]">
          © 2026 Personal Notes &amp; Bookmark Manager
        </div>
      </footer>
    </div>
  );
}
