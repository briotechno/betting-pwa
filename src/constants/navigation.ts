export const getTabs = (t: (key: string) => string) => [
  { id: 'inplay', label: t('nav.inplay'), type: 'pill', icon: '▶', emoji: '▶', href: '/' },
  { id: 'aura', label: t('nav.live_casino'), emoji: '🎲', href: '/markets/live-casino' },
  { id: 'cricket', label: t('nav.cricket'), emoji: '🏏', href: '/sportsbook?sport=cricket' },
  { id: 'soccer', label: t('nav.soccer'), emoji: '⚽', href: '/sportsbook?sport=soccer' },
  { id: 'tennis', label: t('nav.tennis'), emoji: '🎾', href: '/sportsbook?sport=tennis' },
  { id: 'premium', label: t('nav.premium'), emoji: '🛡️', href: '/sportsbook?sport=premium' },
  { id: 'crash', label: t('nav.crash'), emoji: '🚀', href: '/crash-games' },
  { id: 'livecasino', label: t('nav.live_casino'), emoji: '🎲', href: '/markets/live-casino' },
  { id: 'slots', label: t('nav.slot_games'), emoji: '🎰', href: '/casino-slots' },
]
