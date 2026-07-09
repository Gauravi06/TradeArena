'use client';

import { CurrencyProvider } from '@/context/CurrencyContext';
import Navbar from "@/components/Navbar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <Navbar />
      {children}
    </CurrencyProvider>
  );
}