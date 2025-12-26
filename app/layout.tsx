import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImageToFit - Workout Image to ZWO Converter",
  description: "Transform cycling workout images into .zwo files for Zwift, Intervals.icu, and TrainingPeaks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
