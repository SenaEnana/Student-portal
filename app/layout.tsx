import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Student Information System",
  description: "Next.js App Router • REST API • Dynamic Theme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
