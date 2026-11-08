import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Bangla face. Loaded alongside Inter so Bangla strings in the UI — the
   language switch, ৳ copy — render correctly (DS-FND-02, NFR-I18N-01). */
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Voltra — Premium gadgets in Bangladesh",
    template: "%s · Voltra",
  },
  description:
    "Authorized reseller of phones, laptops, tablets, wearables, audio and gaming gear. 0% EMI up to 24 months, nationwide delivery and store pickup.",
  metadataBase: new URL("https://voltra.example"),
  openGraph: {
    type: "website",
    siteName: "Voltra",
    locale: "en_BD",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Text must reach 200% without being blocked (DS-A11Y-07). */
  maximumScale: 5,
  /* Browser chrome colour. The one place a literal is unavoidable: metadata
     is serialised before CSS exists, so it cannot read --color-canvas. Keep
     this in step with that token. */
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hindSiliguri.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
