const base = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const SearchIcon = () => <svg {...base}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const PlusIcon = () => <svg {...base}><path d="M12 5v14M5 12h14" /></svg>;
export const EditIcon = () => <svg {...base}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
export const TrashIcon = () => <svg {...base}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>;
export const CloseIcon = () => <svg {...base}><path d="M18 6 6 18M6 6l12 12" /></svg>;
export const SortIcon = ({ dir }) => (
  <svg {...base} width="12" height="12" style={{ opacity: dir ? 1 : 0.35 }}>
    {dir === 'asc' ? <path d="m6 15 6-6 6 6" /> : dir === 'desc' ? <path d="m6 9 6 6 6-6" /> : <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />}
  </svg>
);
export const EyeIcon = () => <svg {...base} width="18" height="18"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const EyeOffIcon = () => <svg {...base} width="18" height="18"><path d="M3 3l18 18" /><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.5C3.8 8.3 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>;
export const LogoMark = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
    <rect width="30" height="30" rx="9" fill="#fff" />
    <rect x="6" y="8" width="18" height="3.4" rx="1.7" fill="#4C8DFF" />
    <rect x="6" y="13.3" width="13" height="3.4" rx="1.7" fill="#FFB020" />
    <rect x="6" y="18.6" width="8" height="3.4" rx="1.7" fill="#2BD4A0" />
  </svg>
);
