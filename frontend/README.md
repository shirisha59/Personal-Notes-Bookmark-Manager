## Personal Notes & Bookmark Manager – Frontend

Next.js + Tailwind CSS UI for managing notes and bookmarks.

### Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: React + Tailwind CSS

### Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure API base URL**

   Copy `.env.local.example` to `.env.local` and adjust if needed:

   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser.

### Pages

- `/` – overview
- `/notes` – create, search, tag, favorite, update and delete notes
- `/bookmarks` – create, search, tag, favorite, update and delete bookmarks

### Notes

- All data is loaded from the backend REST API.
- Tag filters and text search are applied via query params to the API.
