'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { BlumikSettings } from './settings';
const SettingsContext = createContext<BlumikSettings | null>(null);
export function SettingsProvider({
  value,
  children,
}: {
  value: BlumikSettings;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
export function useBlumikSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw Error('SettingsProvider missing');
  return value;
}
