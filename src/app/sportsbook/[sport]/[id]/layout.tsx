import { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ sport: 'cricket', id: '1' }];
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
