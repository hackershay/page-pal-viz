import { useState, useCallback } from 'react';
import { Algorithm, SimulationResult } from '@/lib/types';
import { runSimulation } from '@/lib/simulator';
import ControlPanel from '@/components/ControlPanel';
import FrameMatrix from '@/components/FrameMatrix';
import StatsPanel from '@/components/StatsPanel';
import FaultChart from '@/components/FaultChart';
import { Cpu } from 'lucide-react';

const Index = () => {
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(
    (refString: number[], frameCount: number, algorithms: Algorithm[]) => {
      setIsRunning(true);
      const newResults = algorithms.map((algo) => runSimulation(algo, refString, frameCount));
      setResults(newResults);
      setIsRunning(false);
    },
    []
  );

  const handleReset = useCallback(() => {
    setResults([]);
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center glow-primary">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold text-foreground tracking-wide">
              Page Replacement Simulator
            </h1>
            <p className="text-[11px] font-mono text-muted-foreground">
              FIFO · LRU · Optimal
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <ControlPanel onRun={handleRun} onReset={handleReset} isRunning={isRunning} />
            {results.length > 0 && <StatsPanel results={results} />}
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 glow-primary">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-lg font-mono font-semibold text-foreground mb-2">
                  Ready to Simulate
                </h2>
                <p className="text-sm font-mono text-muted-foreground max-w-sm">
                  Configure your reference string and frame count, select algorithms, then hit Run.
                </p>
              </div>
            ) : (
              <>
                {results.map((r) => (
                  <FrameMatrix key={r.algorithm} result={r} />
                ))}
                <FaultChart results={results} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
