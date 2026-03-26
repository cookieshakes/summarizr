import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summarizr",
  description: "AI Summary application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
