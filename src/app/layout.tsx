// app/layout.tsx
import "./globals.css";
import { QueryProvider } from "./providers";

export const metadata = { title: "GL2", description: "..." };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
