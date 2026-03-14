import '../styles/globals.css';
import React from "react";
import { Inter } from 'next/font/google';
import ReactQueryProvider from "../components/ReactQueryProvider";
import { ToastContainer } from "../components/ui/toast";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js Application</title>
      </head>
      <body>
        <ReactQueryProvider>
          {children}
          <ToastContainer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}