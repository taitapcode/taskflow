'use client';
import { HeroUIProvider } from '@heroui/react';

export default function Provider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
