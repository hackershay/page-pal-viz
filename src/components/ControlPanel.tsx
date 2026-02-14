import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Algorithm } from '@/lib/types';
import { generateReferenceString } from '@/lib/simulator';
import { Dices, Play, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  onRun: (refString: number[], frameCount: number, algorithms: Algorithm[]) => void;
  onReset: () => void;
  isRunning: boolean;
}

const ALGORITHMS: Algorithm[] = ['FIFO', 'LRU', 'Optimal'];

export default function ControlPanel({ onRun, onReset, isRunning }: ControlPanelProps) {
  const [refStringInput, setRefStringInput] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2');
  const [frameCount, setFrameCount] = useState(3);
  const [selectedAlgos, setSelectedAlgos] = useState<Algorithm[]>(['FIFO', 'LRU', 'Optimal']);
  const [strLength, setStrLength] = useState(15);
  const [maxPage, setMaxPage] = useState(8);

  const toggleAlgo = (algo: Algorithm) => {
    setSelectedAlgos((prev) =>
      prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo]
    );
  };

  const handleGenerate = () => {
    const str = generateReferenceString(strLength, maxPage);
    setRefStringInput(str.join(','));
  };

  const handleRun = () => {
    const refString = refStringInput.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (refString.length === 0 || selectedAlgos.length === 0) return;
    onRun(refString, frameCount, selectedAlgos);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-5">
      <h2 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider">
        Controls
      </h2>

      <div className="space-y-2">
        <Label className="text-xs font-mono text-muted-foreground">Reference String</Label>
        <div className="flex gap-2">
          <Input
            value={refStringInput}
            onChange={(e) => setRefStringInput(e.target.value)}
            placeholder="e.g. 7,0,1,2,0,3"
            className="font-mono text-sm bg-muted border-border"
          />
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-xs font-mono text-muted-foreground">Length</Label>
            <Input
              type="number"
              value={strLength}
              onChange={(e) => setStrLength(Number(e.target.value))}
              min={1}
              max={50}
              className="font-mono text-sm bg-muted border-border"
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs font-mono text-muted-foreground">Max Page</Label>
            <Input
              type="number"
              value={maxPage}
              onChange={(e) => setMaxPage(Number(e.target.value))}
              min={2}
              max={20}
              className="font-mono text-sm bg-muted border-border"
            />
          </div>
          <Button onClick={handleGenerate} variant="outline" size="sm" className="shrink-0">
            <Dices className="w-4 h-4 mr-1" /> Generate
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-mono text-muted-foreground">Frame Count</Label>
        <Input
          type="number"
          value={frameCount}
          onChange={(e) => setFrameCount(Number(e.target.value))}
          min={1}
          max={10}
          className="font-mono text-sm bg-muted border-border w-24"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-mono text-muted-foreground">Algorithms</Label>
        <div className="flex gap-2">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo}
              onClick={() => toggleAlgo(algo)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                selectedAlgos.includes(algo)
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleRun} disabled={isRunning} className="flex-1 font-mono">
          <Play className="w-4 h-4 mr-1" /> Run Simulation
        </Button>
        <Button onClick={onReset} variant="outline" size="icon">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
