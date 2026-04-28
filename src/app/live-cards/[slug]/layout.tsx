import { ReactNode } from 'react';

export function generateStaticParams() {
  return [
    { slug: 'teenpatti' },
    { slug: 'hilow' },
    { slug: 'andarbahar' },
    { slug: 'amarakbaranthony' },
    { slug: '32cardcasino' },
    { slug: '2-card-teenpatti' },
    { slug: '2cardteenpatti' }
  ];
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
