## Personal Notes & Bookmark Manager

Full-stack app to manage personal notes and bookmarks with tags, search, and favorites.

### Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: Next.js (App Router), React, Tailwind CSS

---

### Backend Setup (`backend`)

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   # then edit .env if needed
   ```

   Key variables:

   - `MONGODB_URI` – MongoDB connection string
   - `PORT` – API port (default `4000`)
   - `JWT_SECRET` – secret for signing JWTs

3. Run the API:

   ```bash
   npm run dev
   # or
   npm start
   ```

   The API will be available at `http://localhost:4000/api`.

#### API Routes (summary)

- **Health**
  - `GET /api/health`

- **Auth (optional, JWT)**
  - `POST /api/auth/register`
  - `POST /api/auth/login`

- **Notes**
  - `POST /api/notes`
  - `GET /api/notes?q=searchTerm&tags=tag1,tag2`
  - `GET /api/notes/:id`
  - `PUT /api/notes/:id`
  - `DELETE /api/notes/:id`

- **Bookmarks**
  - `POST /api/bookmarks`
  - `GET /api/bookmarks?q=searchTerm&tags=tag1,tag2`
  - `GET /api/bookmarks/:id`
  - `PUT /api/bookmarks/:id`
  - `DELETE /api/bookmarks/:id`

If `title` is empty when creating a bookmark, the backend will try to fetch the page and auto-fill the title.

Use `Authorization: Bearer <token>` (from `/api/auth/login`) to scope data per user. Without a token, data is considered unauthenticated/global.

---

### Frontend Setup (`frontend`)

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Configure API base URL:

   ```bash
   cp .env.local.example .env.local
   # adjust NEXT_PUBLIC_API_BASE_URL if needed
   ```

3. Run the Next.js dev server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

#### Frontend Pages

- `/` – overview
- `/notes` – CRUD for notes, search, tag filters, favorites
- `/bookmarks` – CRUD for bookmarks, search, tag filters, favorites

---

### Sample cURL Requests

Create a note:

```bash
curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Body","tags":["personal","ideas"]}'
```

Search bookmarks:

```bash
curl "http://localhost:4000/api/bookmarks?q=nextjs&tags=web,react"
```

