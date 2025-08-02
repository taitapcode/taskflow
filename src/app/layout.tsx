import './globals.css';
import type { Metadata } from 'next';
import Provider from './provider';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'TaskFlow is a task management app that helps you organize your tasks efficiently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
