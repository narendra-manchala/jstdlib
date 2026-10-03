import { useState, type ReactNode } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { Deque, PriorityQueue } from '../../../src/ds';


export function PlayButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
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

export function PlayInput({ value, onChange, onEnter, placeholder, type = 'text' }: {
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

export function QueueViz({ items, frontLabel, backLabel }: {
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

export function DequePlayground() {
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

export function PQPlayground() {
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

export const PLAYGROUNDS: Record<string, React.ReactElement> = {
  'deque':          <DequePlayground />,
  'priority-queue': <PQPlayground />,
};

export function TryItPanel({ id }: { id: string }) {
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