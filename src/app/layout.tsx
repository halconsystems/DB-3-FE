import '../styles/globals.css';
import React from "react";
import { Inter, Poppins } from 'next/font/google';
import ReactQueryProvider from "../components/ReactQueryProvider";
import { ToastContainer } from "../components/ui/toast";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Halcon Identity Management System</title>
      </head>
      <body style={{ fontFamily: `${poppins.style.fontFamily}, sans-serif` }}>
        <ReactQueryProvider>
          {children}
          <ToastContainer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}