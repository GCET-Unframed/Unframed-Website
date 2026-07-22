import type { Metadata } from "next";
import { Figtree, Space_Grotesk, Lora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Unframed — Unframe the story. Reframe your own opinion.",
  description:
    "Unframed is a student-led civic initiative helping young people recognize framing and bias in news and legislation — and form their own informed opinions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${spaceGrotesk.variable} ${lora.variable} min-h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {/* Ambient glassmorphism glow — fixed, blurred, low-opacity blobs
            sitting behind every page on top of the continuous gradient. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-royal/25 blur-[100px]" />
          <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-orange/20 blur-[110px]" />
          <div className="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-royal/15 blur-[100px]" />
        </div>
        <AuthProvider>
          <Nav />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
