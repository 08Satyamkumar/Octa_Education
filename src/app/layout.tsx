import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Octa Education Consultants - Premier College Discovery & Admission Guidance",
  description:
    "Find your ideal college in India with Octa Education Consultants. Comprehensive search for engineering, medical, law, MBA courses, predictors, comparison tools, and credit card admission guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen overflow-x-clip bg-background">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
