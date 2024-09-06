import type { Metadata } from "next";
import "../globals.scss";

export const metadata: Metadata = {
  title: "Dojo Discoverer",
  description:
    "Discover jiu-jitsu gyms around the world with Dojo Discoverer. Search by city, class type, and available times to find your ideal BJJ training location.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
