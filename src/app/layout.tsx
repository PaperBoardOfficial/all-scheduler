import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProvider } from "@/providers/QueryClientProvider";

export const metadata: Metadata = {
  title: "All Scheduler",
  description: "Book available time slots easily",
  icons: null,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
