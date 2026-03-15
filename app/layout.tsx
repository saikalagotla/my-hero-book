import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "My Hero Book — Personalized Children's Stories",
  description: 'Create a one-of-a-kind storybook starring your child, powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-book-cream min-h-screen">
        {children}
      </body>
    </html>
  );
}
