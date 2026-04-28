import { ReactNode } from 'react';

export function generateStaticParams() {
  return [
    { slug: 'roulette' },
    { slug: 'lightningdice' },
    { slug: 'crazytime' },
    { slug: 'dealnodeal' },
    { slug: 'moneywheel' },
    { slug: 'dragontiger' }
  ];
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
