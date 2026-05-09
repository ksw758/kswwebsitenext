'use client';

import { ReactNode } from 'react';
import './i18n'; // initialises i18next on the client

export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
