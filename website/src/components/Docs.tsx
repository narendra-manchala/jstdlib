import { useEffect } from 'react';
import type { DocItem, MethodDoc } from '../docs';
import { Badge, CodeBlock, Label, Divider } from './ui';
import { TryItPanel, PLAYGROUNDS } from './Playgrounds';

export function ParamsTable({ params }: { params: NonNullable<MethodDoc['params']> }) {
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

export function MethodBlock({ name, doc }: { name: string; doc: MethodDoc }) {
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

export function DocPage({ item }: { item: DocItem }) {
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