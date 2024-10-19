import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Financial Literacy 101',
  description: 'Boost your financial skills with our interactive AI assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header can be added here */}
        {/* <header className="bg-blue-600 p-4 text-white text-center">
          <h1 className="text-3xl font-bold">Financial Literacy Chat</h1>
        </header> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
