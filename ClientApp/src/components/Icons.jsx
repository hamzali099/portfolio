const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Mail = (p) => (<svg {...base} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>);
export const MapPin = (p) => (<svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
export const LinkedIn = (p) => (<svg {...base} {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>);
export const Briefcase = (p) => (<svg {...base} {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
export const Cap = (p) => (<svg {...base} {...p}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>);
export const Building = (p) => (<svg {...base} {...p}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>);
export const Activity = (p) => (<svg {...base} {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>);
export const Chart = (p) => (<svg {...base} {...p}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>);
export const Send = (p) => (<svg {...base} {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>);
export const Menu = (p) => (<svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>);
export const Close = (p) => (<svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const Arrow = (p) => (<svg {...base} {...p}><path d="M5 12h14M12 5l7 7-7 7" /></svg>);
export const Code = (p) => (<svg {...base} {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>);

export const highlightIcon = { building: Building, activity: Activity, chart: Chart };

export const Server = (p) => (<svg {...base} {...p}><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 6h.01M6 18h.01" /></svg>);
export const Layout = (p) => (<svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>);
export const Monitor = (p) => (<svg {...base} {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>);
export const Github = (p) => (<svg {...base} {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>);
export const External = (p) => (<svg {...base} {...p}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>);
export const Sun = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></svg>);
export const Moon = (p) => (<svg {...base} {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>);
export const ArrowUp = (p) => (<svg {...base} {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>);
export const Check = (p) => (<svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>);
export const Star = (p) => (<svg {...base} {...p}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1Z" /></svg>);
export const Download = (p) => (<svg {...base} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>);

export const skillIcon = { server: Server, layout: Layout, monitor: Monitor };
export const projectIcon = { 'Web App': Activity, Desktop: Monitor, PHP: Code };
