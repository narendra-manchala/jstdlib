import { useState } from 'react';
import { Moon, Sun, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { DOCS } from '../docs';


export function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <li>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-full text-left px-3 py-2 text-[14px] rounded-lg cursor-pointer font-medium"
        style={{
          background: active ? 'var(--pill-bg)' : hover ? 'var(--bg-hover)' : 'transparent',
          color:      active ? 'var(--pill-text)' : 'var(--text-body)',
        }}
      >
        {label}
      </button>
    </li>
  );
}

export function SidebarContents({
  dark, toggleDark, activeId, navigate, onNavClick,
}: {
  dark: boolean;
  toggleDark: () => void;
  activeId: string;
  navigate: (id: string) => void;
  onNavClick?: () => void;
}) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleSection = (s: string) => setCollapsed(p => ({ ...p, [s]: !p[s] }));

  const filtered = DOCS
    .map(g => ({ ...g, items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())) }))
    .filter(g => g.items.length > 0);

  return (
    <>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="mono text-[16px] font-semibold" style={{ color: 'var(--text)' }}>jstdlib</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>JS Standard Library</p>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="https://github.com/narendra-manchala/jstdlib" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.37 4.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border-mid)', color: 'var(--text-muted)' }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg border focus:outline-none"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>No results for "{search}"</p>
        )}
        {filtered.map(group => (
          <div key={group.section}>
            <button
              onClick={() => toggleSection(group.section)}
              className="w-full flex items-center justify-between mb-2 cursor-pointer"
            >
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{group.section}</span>
              {collapsed[group.section]
                ? <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                : <ChevronDown  size={14} style={{ color: 'var(--text-muted)' }} />
              }
            </button>
            {!collapsed[group.section] && (
              <ul className="space-y-0.5 list-none p-0 m-0">
                {group.items.map(item => (
                  <NavItem
                    key={item.id}
                    label={item.label}
                    active={activeId === item.id}
                    onClick={() => { navigate(item.id); onNavClick?.(); }}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
        <p className="mono text-[11px]" style={{ color: 'var(--text-subtle)' }}>v0.1.0</p>
      </div>
    </>
  );
}