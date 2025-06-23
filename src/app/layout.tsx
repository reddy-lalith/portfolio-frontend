import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lalith Reddy",
  description: "Full-Stack Engineer at UNC Chapel Hill. Currently working on Leetpuzzle and Pit Patter.",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-gray-300`}
      >
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
