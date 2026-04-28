import { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ sport: 'Cricket' }, { sport: 'Football' }, { sport: 'Tennis' }, { sport: 'cricket' }, { sport: 'football' }, { sport: 'tennis' }];
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
