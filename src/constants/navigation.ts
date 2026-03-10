export const getTabs = (t: (key: string) => string) => [
  { id: 'inplay', label: t('nav.inplay'), type: 'pill', icon: '▶', emoji: '▶', href: '/' },
  { id: 'aura', label: t('nav.casino'), emoji: '🎲', href: '/casino?tab=aura' },
  { id: 'cricket', label: t('nav.cricket'), emoji: '🏏', href: '/sports?sport=cricket' },
  { id: 'soccer', label: t('nav.soccer'), emoji: '⚽', href: '/sports?sport=soccer' },
  { id: 'tennis', label: t('nav.tennis'), emoji: '🎾', href: '/sports?sport=tennis' },
  { id: 'premium', label: t('nav.premium'), emoji: '🛡️', href: '/sports?sport=premium' },
  { id: 'crash', label: t('nav.crash'), emoji: '🏅', href: '/casino?tab=crash' },
  { id: 'livecasino', label: t('nav.live_casino'), emoji: '🎲', emoji2: '🎲', href: '/casino' },
  { id: 'slots', label: t('nav.slot_games'), emoji: '🎰', href: '/casino?tab=slots' },
]
