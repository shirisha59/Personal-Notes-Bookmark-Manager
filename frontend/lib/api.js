const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem("authToken", token);
    } else {
      window.localStorage.removeItem("authToken");
    }
  }
}

export function loadAuthTokenFromStorage() {
  if (typeof window === "undefined") return;
  const stored = window.localStorage.getItem("authToken");
  authToken = stored || null;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Notes
  listNotes: ({ q, tags } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tags && tags.length) params.set("tags", tags.join(","));
    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`/notes${query}`);
  },
  createNote: (payload) =>
    request("/notes", { method: "POST", body: JSON.stringify(payload) }),
  updateNote: (id, payload) =>
    request(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: "DELETE" }),

  // Bookmarks
  listBookmarks: ({ q, tags } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tags && tags.length) params.set("tags", tags.join(","));
    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`/bookmarks${query}`);
  },
  createBookmark: (payload) =>
    request("/bookmarks", { method: "POST", body: JSON.stringify(payload) }),
  updateBookmark: (id, payload) =>
    request(`/bookmarks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteBookmark: (id) => request(`/bookmarks/${id}`, { method: "DELETE" }),
};

