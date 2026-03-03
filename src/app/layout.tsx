import '../styles/globals.css';
import React from "react";

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', 
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js Application</title>
      </head>
      <body>{children}</body>
    </html>
  );
}