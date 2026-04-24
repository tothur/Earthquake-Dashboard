import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: 'green' | 'amber' | 'orange' | 'red' | 'violet';
}

const toneClasses = {
  green: 'bg-signal-green/15 text-signal-green',
  amber: 'bg-signal-amber/15 text-signal-amber',
  orange: 'bg-signal-orange/15 text-signal-orange',
  red: 'bg-signal-red/15 text-signal-red',
  violet: 'bg-signal-violet/15 text-signal-violet',
};

export function StatCard({ label, value, detail, icon: Icon, tone = 'green' }: StatCardProps) {
  return (
    <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] ${toneClasses[tone]}`}>
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 min-h-5 text-sm text-slate-400">{detail}</p>
    </article>
  );
}
