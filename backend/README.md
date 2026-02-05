## Personal Notes & Bookmark Manager – Backend

Express + MongoDB REST API for managing personal notes and bookmarks.

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)

### Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and adjust values:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/personal_notes_bookmarks
   PORT=4000
   JWT_SECRET=change_me_super_secret
   ```

3. **Run the server**

   ```bash
   npm run dev
   # or
   npm start
   ```

   The API will be available at `http://localhost:4000`.

### API Overview

Base URL: `http://localhost:4000/api`

#### Auth (optional, JWT)

- `POST /api/auth/register`
- `POST /api/auth/login`

Include `Authorization: Bearer <token>` to scope data per user. If omitted, data is treated as unauthenticated/global.

#### Notes

- `POST /api/notes`
- `GET /api/notes?q=search&tags=tag1,tag2`
- `GET /api/notes/:id`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

#### Bookmarks

- `POST /api/bookmarks`
- `GET /api/bookmarks?q=search&tags=tag1,tag2`
- `GET /api/bookmarks/:id`
- `PUT /api/bookmarks/:id`
- `DELETE /api/bookmarks/:id`

If `title` is left empty when creating a bookmark, the server will try to fetch the page and auto-populate the title.

