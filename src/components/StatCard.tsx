import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: 'green' | 'amber' | 'orange' | 'red' | 'violet';
  onClick?: () => void;
  actionLabel?: string;
}

const toneClasses = {
  green: 'bg-signal-green/15 text-signal-green',
  amber: 'bg-signal-amber/15 text-signal-amber',
  orange: 'bg-signal-orange/15 text-signal-orange',
  red: 'bg-signal-red/15 text-signal-red',
  violet: 'bg-signal-violet/15 text-signal-violet',
};

export function StatCard({ label, value, detail, icon: Icon, tone = 'green', onClick, actionLabel }: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-400">{label}</p>
          <p className="mt-2 font-numeric text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] ${toneClasses[tone]}`}>
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 min-h-5 text-sm text-slate-400">{detail}</p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="surface-refined rounded-[8px] border border-white/10 bg-white/[0.045] p-4 text-left shadow-panel transition hover:-translate-y-0.5 hover:border-signal-orange/40 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/70"
        aria-label={actionLabel ?? label}
        title={actionLabel ?? label}
      >
        {content}
      </button>
    );
  }

  return (
    <article className="surface-refined rounded-[8px] border border-white/10 bg-white/[0.045] p-4 shadow-panel">
      {content}
    </article>
  );
}
