import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relay — Physical Music Player",
  description: "A tactile miniature music player built with React and CSS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
