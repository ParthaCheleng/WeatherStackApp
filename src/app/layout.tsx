import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aether | SaaS Weather Intelligence",
  description: "Premium global weather insights with a modern, glassmorphic experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased bg-brand-900 text-slate-100 min-h-screen`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow delay-1000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow delay-700"></div>
        </div>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
