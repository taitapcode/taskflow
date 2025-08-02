import { ShootingStars } from '@/components/ShootingStars';
import { StarsBackground } from '@/components/StarBackground';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen items-center justify-center'>
      <StarsBackground />
      <ShootingStars />
      <main className='z-10'>{children}</main>
    </div>
  );
}
