import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchoolHub Admin",
  description: "Secure administration dashboard for SchoolHub"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
