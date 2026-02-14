export type Algorithm = 'FIFO' | 'LRU' | 'Optimal';

export interface Snapshot {
  step: number;
  page: number;
  frames: (number | null)[];
  isFault: boolean;
  replacedPage: number | null;
  explanation: string;
}

export interface SimulationResult {
  algorithm: Algorithm;
  snapshots: Snapshot[];
  totalFaults: number;
  faultRate: number;
  referenceString: number[];
  frameCount: number;
}

export interface ComparisonRow {
  frameCount: number;
  fifoFaults: number;
  lruFaults: number;
  optimalFaults: number;
}
