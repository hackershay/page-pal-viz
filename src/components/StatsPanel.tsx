import { SimulationResult } from '@/lib/types';

interface StatsPanelProps {
  results: SimulationResult[];
}

export default function StatsPanel({ results }: StatsPanelProps) {
  if (results.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h2 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider">
        Comparison
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground text-xs">Algorithm</th>
              <th className="text-right py-2 px-3 text-muted-foreground text-xs">Frames</th>
              <th className="text-right py-2 px-3 text-muted-foreground text-xs">Faults</th>
              <th className="text-right py-2 px-3 text-muted-foreground text-xs">Hits</th>
              <th className="text-right py-2 px-3 text-muted-foreground text-xs">Fault Rate</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const hits = r.snapshots.length - r.totalFaults;
              const best = r.totalFaults === Math.min(...results.map((x) => x.totalFaults));
              return (
                <tr
                  key={r.algorithm}
                  className={`border-b border-border/50 ${best ? 'bg-success/5' : ''}`}
                >
                  <td className="py-2 px-3 font-semibold">
                    <span className={best ? 'text-success' : 'text-foreground'}>{r.algorithm}</span>
                    {best && <span className="ml-2 text-[10px] text-success">★ BEST</span>}
                  </td>
                  <td className="text-right py-2 px-3 text-muted-foreground">{r.frameCount}</td>
                  <td className="text-right py-2 px-3 text-destructive font-semibold">{r.totalFaults}</td>
                  <td className="text-right py-2 px-3 text-success">{hits}</td>
                  <td className="text-right py-2 px-3">
                    <span className="text-warning font-semibold">
                      {(r.faultRate * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual bar comparison */}
      <div className="space-y-3 pt-2">
        {results.map((r) => {
          const maxFaults = Math.max(...results.map((x) => x.totalFaults));
          const pct = maxFaults > 0 ? (r.totalFaults / maxFaults) * 100 : 0;
          return (
            <div key={r.algorithm} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">{r.algorithm}</span>
                <span className="text-foreground">{r.totalFaults} faults</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
