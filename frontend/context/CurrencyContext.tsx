'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  convert: (usdAmount: number) => number;
}

const defaultValue: CurrencyContextType = {
  currency: 'USD',
  toggleCurrency: () => {},
  convert: (amount) => amount,
};

const CurrencyContext = createContext<CurrencyContextType>(defaultValue);

const USD_TO_INR = 83;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('currency') as Currency;
    if (saved) setCurrency(saved);
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'INR' : 'USD';
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const convert = (usdAmount: number): number => {
    return currency === 'INR' ? usdAmount * USD_TO_INR : usdAmount;
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}