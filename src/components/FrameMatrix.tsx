import { SimulationResult } from '@/lib/types';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FrameMatrixProps {
  result: SimulationResult;
}

export default function FrameMatrix({ result }: FrameMatrixProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { snapshots, referenceString, frameCount } = result;
  const snapshot = snapshots[currentStep];

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider">
          {result.algorithm} — Frame Matrix
        </h2>
        <span className="text-xs font-mono text-muted-foreground">
          Step {currentStep + 1}/{snapshots.length}
        </span>
      </div>

      {/* Reference string timeline */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {referenceString.map((page, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`shrink-0 w-9 h-9 rounded text-xs font-mono font-semibold flex items-center justify-center transition-all ${
              i === currentStep
                ? 'bg-primary text-primary-foreground glow-primary scale-110'
                : i < currentStep
                ? snapshots[i].isFault
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-success/15 text-success'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Frame state */}
      <div className="space-y-2">
        {Array.from({ length: frameCount }, (_, f) => (
          <div key={f} className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground w-14">
              F{f}
            </span>
            <div
              className={`flex-1 h-10 rounded border flex items-center justify-center font-mono font-semibold text-sm transition-all ${
                snapshot.frames[f] === snapshot.page && snapshot.isFault
                  ? 'border-primary bg-primary/15 text-primary glow-primary'
                  : snapshot.frames[f] !== null
                  ? 'border-border bg-muted text-foreground'
                  : 'border-border/50 bg-muted/50 text-muted-foreground'
              }`}
            >
              {snapshot.frames[f] !== null ? snapshot.frames[f] : '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div
        className={`rounded p-3 text-xs font-mono ${
          snapshot.isFault
            ? 'bg-destructive/10 text-destructive border border-destructive/20'
            : 'bg-success/10 text-success border border-success/20'
        }`}
      >
        <span className="font-semibold">{snapshot.isFault ? '✗ FAULT' : '✓ HIT'}</span>
        {' — '}
        {snapshot.explanation}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setCurrentStep(0)} disabled={currentStep === 0}>
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setCurrentStep((s) => Math.min(snapshots.length - 1, s + 1))} disabled={currentStep === snapshots.length - 1}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setCurrentStep(snapshots.length - 1)} disabled={currentStep === snapshots.length - 1}>
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
