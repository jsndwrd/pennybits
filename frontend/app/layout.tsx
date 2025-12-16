import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import AppToaster from "./components/AppToaster";
import MotionProvider from "./components/MotionProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pennybits",
  description: "Full-Stack Financial Tracker App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} bg-background text-foreground antialiased`}
        >
          <MotionProvider>{children}</MotionProvider>
          <AppToaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
