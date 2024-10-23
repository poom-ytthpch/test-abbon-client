// src/components/ApolloWrapper.tsx
'use client';  // ทำให้ component นี้เป็น client component

import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';
import client from '../apollo/client';

export default function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
