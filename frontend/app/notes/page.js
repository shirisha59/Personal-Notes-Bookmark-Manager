"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";

function TagInput({ value, onChange }) {
  const [input, setInput] = useState("");
  const tags = value || [];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed.toLowerCase())) {
        onChange([...tags, trimmed.toLowerCase()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="flex items-center gap-1 rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#14B8A6] hover:bg-[#14B8A6]/20"
          onClick={() => onChange(tags.filter((t) => t !== tag))}
        >
          <span>{tag}</span>
          <span className="text-[#14B8A6]">×</span>
        </button>
      ))}
      <input
        className="flex-1 bg-transparent px-1 text-sm text-[#111827] outline-none placeholder:text-[#6B7280]"
        placeholder={tags.length ? "Add tag" : "Add tags (press Enter)"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    tags: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () =>
    setForm({ id: null, title: "", content: "", tags: [] });

  const loadNotes = async (options = {}) => {
    const currentSearch =
      options.search !== undefined ? options.search : search;
    const currentTag = options.tag !== undefined ? options.tag : filterTag;

    try {
      setLoading(true);
      setError("");
      const data = await api.listNotes({
        q: currentSearch || undefined,
        tags: currentTag ? [currentTag] : undefined,
      });
      setNotes(data);
    } catch (err) {
      setError(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    const nextErrors = {};
    if (!trimmedTitle) {
      nextErrors.title = "Title is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      setError("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFormErrors({});

      const payload = {
        title: form.title,
        content: form.content,
        tags: form.tags,
      };

      if (form.id) {
        await api.updateNote(form.id, payload);
      } else {
        await api.createNote(payload);
      }

      resetForm();
      setIsModalOpen(false);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (note) => {
    setForm({
      id: note._id,
      title: note.title,
      content: note.content || "",
      tags: note.tags || [],
    });
    setIsModalOpen(true);
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      setLoading(true);
      setError("");
      await api.deleteNote(id);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (note) => {
    try {
      setLoading(true);
      setError("");
      await api.updateNote(note._id, { favorite: !note.favorite });
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [notes]);

  const visibleNotes = showFavoritesOnly
    ? notes.filter((n) => n.favorite)
    : notes;

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
          <nav className="flex items-center gap-4">
            <Link
              href="/notes"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#4F46E5]"
            >
              Notes
            </Link>
            <Link
              href="/bookmarks"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Bookmarks
            </Link>
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              🔍
            </span>
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-[#111827] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleNotes.map((note) => (
            <article
              key={note._id}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="flex-1 text-base font-bold text-[#111827]">
                  {note.title}
                </h3>
                <button
                  type="button"
                  onClick={() => toggleFavorite(note)}
                  className="ml-2 text-lg text-gray-400 hover:text-amber-400"
                  aria-label="Toggle favorite"
                >
                  {note.favorite ? "★" : "☆"}
                </button>
              </div>
              {note.content && (
                <p className="mb-3 line-clamp-3 text-sm text-[#6B7280]">
                  {note.content}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <div className="flex flex-wrap gap-1">
                  {(note.tags || []).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full bg-[#14B8A6]/10 px-2 py-1 text-xs text-[#14B8A6] hover:bg-[#14B8A6]/20"
                      onClick={() => {
                        setFilterTag(tag);
                        loadNotes({ tag });
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(note)}
                    className="text-[#4F46E5] hover:text-[#4338CA]"
                    aria-label="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(note._id)}
                    className="text-[#EF4444] hover:text-[#DC2626]"
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleNotes.length === 0 && !loading && (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-[#111827]">
              {showFavoritesOnly ? "No favorite notes yet." : "No notes yet."}
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Use the &quot;+ Add Note&quot; button to create your first note.
            </p>
          </div>
        )}

        {loading && (
          <div className="py-16 text-center">
            <p className="text-sm text-[#6B7280] animate-pulse">
              Loading notes...
            </p>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        type="button"
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#4F46E5] text-2xl text-white shadow-lg hover:bg-[#4338CA] transition"
        aria-label="Add Note"
      >
        +
      </button>

      {/* Add/Edit Note Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">
                {form.id ? "Edit Note" : "Add Note"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[#EF4444]">
                {error}
              </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Enter note title"
                  required
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">
                  Content
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder="Enter your note content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">
                  Tags
                </label>
                <TagInput
                  value={form.tags}
                  onChange={(tags) => setForm((f) => ({ ...f, tags }))}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60"
                >
                  {form.id ? "Update Note" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
