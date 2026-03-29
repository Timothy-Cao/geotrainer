import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoTrainer",
  description: "Train your world knowledge — languages, flags, shapes, capitals, and more",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-lg font-bold tracking-tight">
              <span className="text-[#00e5ff]">Geo</span>Trainer
            </a>
            <div className="flex gap-6">
              <a
                href="/"
                className="text-sm text-[#888] hover:text-[#e0e0e0] transition-colors"
              >
                Practice
              </a>
              <a
                href="/stats"
                className="text-sm text-[#888] hover:text-[#e0e0e0] transition-colors"
              >
                Stats
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-[#1e1e2e] mt-16 py-6 text-center text-xs text-[#555]">
          Built by Tim Cao
        </footer>
      </body>
    </html>
  );
}
