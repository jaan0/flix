import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyFlix - Stream Movies & TV Shows | HD Quality",
  description:
    "Stream unlimited movies and TV shows in HD quality. Watch your favorite content anytime, anywhere with MyFlix.",
  keywords: [
    "movies",
    "streaming",
    "HD streaming",
    "TV shows",
    "watch online",
    "video streaming",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
