import { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ sport: 'cricket' }];
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
