import localFont from "next/font/local"

export const fontGeistSans = localFont({
  src: [
    {
      path: "../fonts/Geist.ttf",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-geist-sans",
})

export const fontGeistMono = localFont({
  src: [
    {
      path: "../fonts/GeistMono.ttf",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-geist-mono",
})
