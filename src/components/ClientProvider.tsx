'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store/store';

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <Provider store={makeStore()}>{children}</Provider>;
}
