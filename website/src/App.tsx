/**
 * xstd Playground — App.tsx
 *
 * Architecture:
 *   useTheme()           — dark/light toggle with smooth .switching transition
 *   <Sidebar>            — brand, search, collapsible nav sections
 *   <DocPage>            — overview, import snippet, method list, playground
 *   <MethodBlock>        — signature, description, params table, example
 *   <DequePlayground>    — interactive Deque visualiser
 *   <PQPlayground>       — interactive PriorityQueue visualiser
 */

import React, {
  useState, useEffect, useRef,
  type ReactNode,
} from 'react';
import {
  Moon, Sun, Search, ChevronDown, ChevronRight,
  Copy, Check, ArrowRight, Terminal, Menu, X,
} from 'lucide-react';

import { DOCS } from './docs';
import type { DocItem, MethodDoc } from './docs';
import { Deque }         from '../../src/ds';
import { PriorityQueue } from '../../src/ds';

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/** Manages dark / light mode with a coordinated CSS transition window. */
function useTheme() {
  const [dark, setDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Apply on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    // Add .switching → blankets all elements with 400ms transition
    document.documentElement.classList.add('switching');
    setDark(prev => {
      document.documentElement.classList.toggle('dark', !prev);
      return !prev;
    });
    // Remove after transition finishes
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      document.documentElement.classList.remove('switching');
    }, 420);
  };

  return { dark, toggle };
}

/** Clipboard copy with 1.8s "Copied" feedback. */
function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  return { copied, copy };
}

/** URL-hash → active item sync. Resets scroll to top on every navigation. */
function useHash(fallback: string) {
  const [hash, setHash] = useState(() => {
    const h = window.location.hash.replace('#', '');
    return h || fallback;
  });

  useEffect(() => {
    const handler = () => {
      const h = window.location.hash.replace('#', '');
      if (h) {
        // Instant scroll reset — no animation so the new page starts clean
        window.scrollTo({ top: 0, behavior: 'instant' });
        setHash(h);
      }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (id: string) => {
    // Reset scroll first so the content swap isn't jarring
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.location.hash = id;
    setHash(id);
  };

  return { activeId: hash, navigate };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Monospace complexity badge — e.g. "O(1)" */
function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="mono inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
      style={{
        background:   'var(--bg-raised)',
        color:        'var(--text-muted)',
        border:       '1px solid var(--border-mid)',
      }}
    >
      {children}
    </span>
  );
}

/** Code block with always-visible Copy button. */
function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy(code);
  return (
    <div className="relative">
      <pre
        className="mono rounded-xl border text-[13px] leading-[1.75] overflow-x-auto p-4 pr-24"
        style={{
          background:   'var(--bg-raised)',
          borderColor:  'var(--border)',
          color:        'var(--text-body)',
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer"
        style={{
          background:  copied ? 'var(--bg-hover)' : 'var(--bg-sidebar)',
          color:       copied ? 'var(--text)'      : 'var(--text-muted)',
          borderColor: 'var(--border-mid)',
        }}
      >
        {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
      </button>
    </div>
  );
}

/** Section label above a block (UPPERCASE, small, spaced). */
function Label({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[12px] font-semibold uppercase tracking-[0.08em] mb-3"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </p>
  );
}

/** Horizontal rule that respects theme. */
function Divider() {
  return <hr className="border-0 border-t my-0" style={{ borderColor: 'var(--border)' }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMS TABLE
// ─────────────────────────────────────────────────────────────────────────────

function ParamsTable({ params }: { params: NonNullable<MethodDoc['params']> }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-raised)', borderBottom: '1px solid var(--border)' }}>
            {['Param', 'Type', 'Description'].map(h => (
              <th
                key={h}
                className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr
              key={p.name}
              style={{
                background:   i % 2 === 1 ? 'var(--bg-sidebar)' : 'transparent',
                borderBottom: i < params.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <td className="px-4 py-3 mono font-medium w-36" style={{ color: 'var(--text)' }}>
                {p.name}{p.optional && <span style={{ color: 'var(--text-subtle)' }}>?</span>}
              </td>
              <td className="px-4 py-3 mono text-[12px] w-52" style={{ color: 'var(--text-muted)' }}>
                {p.type}
              </td>
              <td className="px-4 py-3" style={{ color: 'var(--text-body)' }}>
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METHOD BLOCK
// ─────────────────────────────────────────────────────────────────────────────

function MethodBlock({ name, doc }: { name: string; doc: MethodDoc }) {
  return (
    <section className="pt-10 pb-14" style={{ borderTop: '1px solid var(--border)' }}>
      {/* .methodName  O(1) */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <h3 className="mono text-[17px] font-semibold m-0" style={{ color: 'var(--text)' }}>
          <span style={{ color: 'var(--text-subtle)' }}>.</span>{name}
        </h3>
        <Badge>{doc.timeComplexity}</Badge>
        {doc.spaceComplexity && <Badge>{doc.spaceComplexity}</Badge>}
      </div>

      {/* Signature */}
      <CodeBlock code={doc.signature} />

      {/* Description */}
      <p className="mt-4 text-[14px] leading-relaxed" style={{ color: 'var(--text-body)' }}>
        {doc.description}
      </p>

      {/* Params */}
      {doc.params && doc.params.length > 0 && (
        <div className="mt-6">
          <Label>Parameters</Label>
          <ParamsTable params={doc.params} />
        </div>
      )}

      {/* Returns */}
      {doc.returns?.type && (
        <div className="mt-5">
          <Label>Returns</Label>
          <span className="mono text-[13px]" style={{ color: 'var(--text)' }}>
            {doc.returns.type}
          </span>
          {doc.returns.description && (
            <span className="text-[13px] ml-2" style={{ color: 'var(--text-muted)' }}>
              — {doc.returns.description}
            </span>
          )}
        </div>
      )}

      {/* Example */}
      <div className="mt-6">
        <Label>Example</Label>
        <CodeBlock code={doc.example} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYGROUNDS
// ─────────────────────────────────────────────────────────────────────────────

function PlayButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="px-3 py-1.5 text-[13px] rounded-lg border cursor-pointer"
      style={{
        background:  hover ? 'var(--bg-hover)' : 'var(--bg)',
        color:        'var(--text-body)',
        borderColor:  'var(--border-mid)',
      }}
    >
      {children}
    </button>
  );
}

function PlayInput({ value, onChange, onEnter, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; onEnter: () => void;
  placeholder: string; type?: string;
}) {
  return (
    <input
      type={type} value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onEnter()}
      placeholder={placeholder}
      className="flex-1 min-w-40 px-3 py-1.5 text-[13px] rounded-lg border focus:outline-none"
      style={{
        background:  'var(--bg-raised)',
        borderColor: 'var(--border-mid)',
        color:       'var(--text)',
      }}
    />
  );
}

function QueueViz({ items, frontLabel, backLabel }: {
  items: string[]; frontLabel?: string; backLabel?: string;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 min-h-14 p-4 rounded-xl border border-dashed"
      style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-mid)' }}
    >
      {items.length === 0
        ? <span className="text-[13px] m-auto" style={{ color: 'var(--text-subtle)' }}>empty</span>
        : items.map((v, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i === 0 && frontLabel && (
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                  {frontLabel}
                </span>
              )}
              <div
                className="mono px-3 py-1.5 rounded-lg text-[13px] font-medium"
                style={{ background: 'var(--pill-bg)', color: 'var(--pill-text)' }}
              >
                {v}
              </div>
              {i < items.length - 1
                ? <ArrowRight size={12} style={{ color: 'var(--text-subtle)' }} />
                : backLabel && (
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                      {backLabel}
                    </span>
                  )
              }
            </div>
          ))
      }
    </div>
  );
}

function DequePlayground() {
  const [dq]    = useState(() => new Deque<string>());
  const [items, setItems] = useState<string[]>([]);
  const [val, setVal]     = useState('');
  const refresh = () => setItems([...dq]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <PlayInput value={val} onChange={setVal} onEnter={() => { if (val.trim()) { dq.pushBack(val.trim()); refresh(); setVal(''); } }} placeholder="Value… (Enter → push back)" />
        <PlayButton onClick={() => { if (val.trim()) { dq.pushFront(val.trim()); refresh(); setVal(''); } }}>Push Front</PlayButton>
        <PlayButton onClick={() => { if (val.trim()) { dq.pushBack(val.trim());  refresh(); setVal(''); } }}>Push Back</PlayButton>
        <PlayButton onClick={() => { dq.popFront(); refresh(); }}>Pop Front</PlayButton>
        <PlayButton onClick={() => { dq.popBack();  refresh(); }}>Pop Back</PlayButton>
      </div>
      <QueueViz items={items} frontLabel="front" backLabel="back" />
      <p className="mono text-[11px]" style={{ color: 'var(--text-subtle)' }}>size: {items.length}</p>
    </div>
  );
}

function PQPlayground() {
  const [pq]  = useState(() => new PriorityQueue<number>((a, b) => a - b));
  const [items, setItems] = useState<number[]>([]);
  const [val, setVal]     = useState('');
  const [last, setLast]   = useState<number | null>(null);
  const refresh = () => setItems([...pq]);

  const push = () => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) { pq.push(n); refresh(); setVal(''); setLast(null); }
  };
  const pop = () => { const n = pq.pop(); refresh(); setLast(n ?? null); };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <PlayInput value={val} onChange={setVal} onEnter={push} placeholder="Number… (Enter → push)" type="number" />
        <PlayButton onClick={push}>Push — O(log N)</PlayButton>
        <PlayButton onClick={pop}>Pop Min — O(log N)</PlayButton>
      </div>
      <QueueViz items={items.map(String)} frontLabel="min" />
      {last !== null && (
        <p className="mono text-[11px]" style={{ color: 'var(--text-subtle)' }}>
          popped: <span className="font-semibold" style={{ color: 'var(--text)' }}>{last}</span>
        </p>
      )}
      <p className="mono text-[11px]" style={{ color: 'var(--text-subtle)' }}>
        size: {items.length} · heap-array order shown
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAYGROUND REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

const PLAYGROUNDS: Record<string, React.ReactElement> = {
  'deque':          <DequePlayground />,
  'priority-queue': <PQPlayground />,
};

// ─────────────────────────────────────────────────────────────────────────────
// TRY IT PANEL  (extracted so it renders in two places)
// ─────────────────────────────────────────────────────────────────────────────

function TryItPanel({ id }: { id: string }) {
  const playground = PLAYGROUNDS[id];
  if (!playground) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Terminal size={13} style={{ color: 'var(--text-muted)' }} />
        <p className="text-[13px] font-semibold m-0" style={{ color: 'var(--text-body)' }}>
          Try it live
        </p>
      </div>
      <div
        className="p-5 rounded-2xl border"
        style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
      >
        {playground}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL TO TOP BUTTON
// ─────────────────────────────────────────────────────────────────────────────

/** Floating button — appears after scrolling 400px, smoothly returns to top. */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 w-9 h-9 flex items-center justify-center rounded-full border cursor-pointer shadow-md"
      style={{
        background:  'var(--bg-sidebar)',
        borderColor: 'var(--border-mid)',
        color:       'var(--text-muted)',
      }}
    >
      ↑
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOC PAGE  (no playground — that lives in the right panel or below on mobile)
// ─────────────────────────────────────────────────────────────────────────────

function DocPage({ item }: { item: DocItem }) {
  const hasPlayground = Boolean(PLAYGROUNDS[item.id]);

  // Safety net: if item changes via any means other than navigate() (e.g. browser back),
  // make sure the view starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [item.id]);

  return (
    <article>
      {/* Header */}
      <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
        {item.label}
      </h2>
      
      {/* Render paragraphs separated by \n\n */}
      <div className="mb-6 max-w-xl text-[14px] sm:text-[15px] leading-relaxed" style={{ color: 'var(--text-body)' }}>
        {item.description.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-3 last:mb-0">
            {/* Simple bold parsing for **Why use this?** */}
            {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={i} style={{ color: 'var(--text)' }}>{part.slice(2, -2)}</strong> 
                : part
            )}
          </p>
        ))}
      </div>
      
      {/* Only show import path if it's a real library module (not the root 'xstd' used for docs) */}
      {item.importPath !== 'xstd' && (
        <CodeBlock code={`import { ${item.label} } from '${item.importPath}';`} />
      )}

      {/* Methods (Only show if there are actual methods to document) */}
      {Object.keys(item.methods).length > 0 && (
        <>
          <h3 className="text-[20px] sm:text-[22px] font-semibold mt-14 mb-0" style={{ color: 'var(--text)' }}>
            {item.id === 'getting-started' ? 'Overview' : 'Methods'}
          </h3>
          {Object.entries(item.methods).map(([name, doc]) => (
            <MethodBlock key={name} name={name} doc={doc} />
          ))}
        </>
      )}

      {/* Try It — visible only on tablet/mobile (xl hides it; right panel shows it there) */}
      {hasPlayground && (
        <div className="mt-2 pb-16 xl:hidden">
          <Divider />
          <div className="pt-10">
            <TryItPanel id={item.id} />
          </div>
        </div>
      )}

      {/* Bottom padding on xl where right panel exists */}
      {!hasPlayground && <div className="pb-16" />}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR CONTENTS  (shared by drawer + desktop aside)
// ─────────────────────────────────────────────────────────────────────────────

function SidebarContents({
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
            href="https://github.com" 
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

// ─────────────────────────────────────────────────────────────────────────────
// NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────

function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const { dark, toggle } = useTheme();
  const { activeId, navigate } = useHash('getting-started');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on resize to md+
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setDrawerOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const activeItem = DOCS.flatMap(g => g.items).find(i => i.id === activeId);
  const hasPlayground = activeItem ? Boolean(PLAYGROUNDS[activeItem.id]) : false;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <ScrollToTopButton />

      {/* ── Mobile header bar ─────────────────────────────────── */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30"
        style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
      >
        <p className="mono text-[15px] font-semibold" style={{ color: 'var(--text)' }}>jstdlib</p>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border-mid)', color: 'var(--text-muted)' }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border-mid)', color: 'var(--text-muted)' }}
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer overlay ─────────────────────────────── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
          {/* Drawer panel */}
          <aside
            className="relative z-50 w-72 flex flex-col h-full overflow-y-auto"
            style={{ background: 'var(--bg-sidebar)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
            <SidebarContents
              dark={dark}
              toggleDark={toggle}
              activeId={activeId}
              navigate={navigate}
              onNavClick={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Main layout ───────────────────────────────────────── */}
      <div className="flex">

        {/* ── Desktop sidebar (md+) ─────────────────────────── */}
        <aside
          className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r overflow-y-auto"
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
        >
          <SidebarContents
            dark={dark}
            toggleDark={toggle}
            activeId={activeId}
            navigate={navigate}
          />
        </aside>

        {/* ── Content + right panel wrapper ─────────────────── */}
        <div className="flex flex-1 min-w-0">

          {/* Doc content */}
          <main className="flex-1 min-w-0 px-5 sm:px-8 xl:px-14 py-10 xl:py-14">
            {activeItem
              ? <DocPage item={activeItem} />
              : <p style={{ color: 'var(--text-muted)' }}>Select a topic from the sidebar.</p>
            }
          </main>

          {/* ── Right sticky panel: Try It (xl+ only) ───────── */}
          {hasPlayground && activeItem && (
            <aside
              className="hidden xl:block w-[340px] shrink-0 px-6 py-14 border-l"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="sticky top-10">
                <TryItPanel id={activeItem.id} />
              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}
