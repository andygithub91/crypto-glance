// app/layout.tsx
import { Metadata } from "next";
import { Providers } from "../providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoGlance - Your Web3 Asset Management Tool",
  description:
    "Manage and track your cryptocurrency assets with CryptoGlance, a sleek and efficient Web3 asset management tool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
