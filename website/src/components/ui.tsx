import { useState, useEffect, type ReactNode } from 'react';
import { useCopy } from '../hooks';
import { Copy, Check } from 'lucide-react';

/** Monospace complexity badge — e.g. "O(1)" */
export function Badge({ children }: { children: ReactNode }) {
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
export function CodeBlock({ code }: { code: string }) {
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
export function Label({ children }: { children: ReactNode }) {
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
export function Divider() {
  return <hr className="border-0 border-t my-0" style={{ borderColor: 'var(--border)' }} />;
}

/** Floating button — appears after scrolling 400px, smoothly returns to top. */
export function ScrollToTopButton() {
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