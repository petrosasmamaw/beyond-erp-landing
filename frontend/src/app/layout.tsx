import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import "./landing.css";

const fontSansClass = "font-sans";

export const metadata: Metadata = {
  title: "Beyond ERP System",
  description: "Business management built for Ethiopia - works offline, speaks your language.",
  manifest: "/manifest.json",
  icons: { icon: "/logo.png", apple: "/logo.png" }
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSansClass} suppressHydrationWarning>
      <head>
        {/* Preload primary Amharic display font */}
        <link
          rel="preload"
          href="/fonts/balderasu.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* Prevent flash of wrong theme - default to dark blue theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('beyond_theme')||'dark';document.documentElement.setAttribute('data-theme',t);})()` }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppProvider>
                {children}
              </AppProvider>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
