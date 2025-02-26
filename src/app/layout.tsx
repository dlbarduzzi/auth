import type { Metadata, Viewport } from "next"

import "@/styles/globals.css"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"
import { fontGeistSans, fontGeistMono } from "@/lib/fonts"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-white font-sans text-base text-black antialiased",
          "selection:bg-yellow-200 selection:text-black",
          fontGeistSans.variable,
          fontGeistMono.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
