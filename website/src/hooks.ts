import { useState, useEffect, useRef } from 'react';

/** Manages dark / light mode with a coordinated CSS transition window. */
export function useTheme() {
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
export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  return { copied, copy };
}

/** URL-hash → active item sync. Resets scroll to top on every navigation. */
export function useHash(fallback: string) {
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