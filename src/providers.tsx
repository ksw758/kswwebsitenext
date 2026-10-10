'use client';

import { ReactNode, useEffect } from 'react';
import './i18n'; // initialises i18next on the client
import { captureAttribution } from '@/src/lib/attribution';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    captureAttribution();
  }, []);

  return <>{children}</>;
}
