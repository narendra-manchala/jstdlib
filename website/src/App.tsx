import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { DOCS } from './docs';
import { useTheme, useHash } from './hooks';
import { SidebarContents } from './components/Sidebar';
import { DocPage } from './components/Docs';
import { ScrollToTopButton } from './components/ui';
import { TryItPanel, PLAYGROUNDS } from './components/Playgrounds';

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