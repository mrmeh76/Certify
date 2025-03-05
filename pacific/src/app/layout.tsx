import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { siteConfig } from "../../config/site-config";
import { Toaster } from "sonner";
import { AppBar } from "@/components/app-bar";
import "./globals.css";
import CustomProvider from "./provider";

import { UserProvider } from "@/context/user-provider";
import NavBar from "@/components/nav-bar";
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin-ext"],
  fallback: ["sans-serif"],
});
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <CustomProvider>
          <UserProvider>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <NavBar />
              <AppBar />
            </div>
            {children}
          </UserProvider>
        </CustomProvider>
        <Toaster />
      </body>
    </html>
  );
}
