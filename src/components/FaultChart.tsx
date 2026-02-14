import { SimulationResult } from '@/lib/types';
import { useMemo } from 'react';

interface FaultChartProps {
  results: SimulationResult[];
}

const COLORS: Record<string, string> = {
  FIFO: 'hsl(175, 80%, 50%)',
  LRU: 'hsl(145, 60%, 45%)',
  Optimal: 'hsl(40, 90%, 55%)',
};

export default function FaultChart({ results }: FaultChartProps) {
  const chartData = useMemo(() => {
    return results.map((r) => {
      let cumFaults = 0;
      return {
        algorithm: r.algorithm,
        points: r.snapshots.map((s, i) => {
          if (s.isFault) cumFaults++;
          return { step: i, faults: cumFaults };
        }),
      };
    });
  }, [results]);

  if (results.length === 0) return null;

  const maxSteps = Math.max(...results.map((r) => r.snapshots.length));
  const maxFaults = Math.max(...chartData.flatMap((d) => d.points.map((p) => p.faults)));
  const chartW = 600;
  const chartH = 200;
  const padL = 40;
  const padB = 30;
  const padT = 10;
  const padR = 10;
  const w = chartW - padL - padR;
  const h = chartH - padB - padT;

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h2 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider">
        Cumulative Faults
      </h2>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-[600px]">
          {/* Grid lines */}
          {Array.from({ length: 5 }, (_, i) => {
            const y = padT + (h / 4) * i;
            const val = Math.round(maxFaults - (maxFaults / 4) * i);
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="hsl(220, 15%, 18%)" strokeWidth="1" />
                <text x={padL - 5} y={y + 4} textAnchor="end" fill="hsl(215, 15%, 50%)" fontSize="10" fontFamily="JetBrains Mono">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          {chartData.map((d) => {
            const pathData = d.points
              .map((p, i) => {
                const x = padL + (p.step / Math.max(maxSteps - 1, 1)) * w;
                const y = padT + h - (p.faults / Math.max(maxFaults, 1)) * h;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');

            return (
              <path
                key={d.algorithm}
                d={pathData}
                fill="none"
                stroke={COLORS[d.algorithm]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* X axis label */}
          <text x={padL + w / 2} y={chartH - 5} textAnchor="middle" fill="hsl(215, 15%, 50%)" fontSize="10" fontFamily="JetBrains Mono">
            Steps
          </text>
        </svg>
      </div>

      <div className="flex gap-4 justify-center">
        {chartData.map((d) => (
          <div key={d.algorithm} className="flex items-center gap-2 text-xs font-mono">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[d.algorithm] }} />
            <span className="text-muted-foreground">{d.algorithm}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
