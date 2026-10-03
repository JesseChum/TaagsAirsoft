import type { Metadata } from "next";
import { Barlow, Big_Shoulders, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UtilityBar } from "@/components/utility-bar";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  weight: ["600", "800", "900"],
  subsets: ["latin"],
  adjustFontFallback: false, // Next has no fallback metrics for this font
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "T.A.A.G.S. Airsoft · Kent, WA",
    template: "%s · T.A.A.G.S. Airsoft",
  },
  description: "Outdoor airsoft games in Kent, WA.",
  icons: { icon: "/taags-patch.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${barlow.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <UtilityBar />
        {/* The header floats over the top of each page, so pages without a
            hero need top padding (pt-24) to clear it. */}
        <div className="relative flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
