import "./globals.css";

export const metadata = {
  title: "Personal Notes & Bookmarks",
  description: "Manage your notes and bookmarks in one place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9FAFB] text-[#111827] antialiased">
        {children}
      </body>
    </html>
  );
}
