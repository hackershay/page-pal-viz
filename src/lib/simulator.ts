import { Algorithm, Snapshot, SimulationResult } from './types';

function simulateFIFO(refString: number[], frameCount: number): Snapshot[] {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const snapshots: Snapshot[] = [];
  const queue: number[] = [];

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    const inFrames = frames.includes(page);

    if (inFrames) {
      snapshots.push({
        step: i,
        page,
        frames: [...frames],
        isFault: false,
        replacedPage: null,
        explanation: `Page ${page} is already in memory. No fault.`,
      });
    } else {
      let replacedPage: number | null = null;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        queue.push(page);
        snapshots.push({
          step: i,
          page,
          frames: [...frames],
          isFault: true,
          replacedPage: null,
          explanation: `Page ${page} not found. Loaded into empty frame ${emptyIdx}.`,
        });
      } else {
        replacedPage = queue.shift()!;
        const idx = frames.indexOf(replacedPage);
        frames[idx] = page;
        queue.push(page);
        snapshots.push({
          step: i,
          page,
          frames: [...frames],
          isFault: true,
          replacedPage,
          explanation: `Page ${page} not found. Replaced page ${replacedPage} (oldest in queue).`,
        });
      }
    }
  }
  return snapshots;
}

function simulateLRU(refString: number[], frameCount: number): Snapshot[] {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const snapshots: Snapshot[] = [];
  const useOrder: number[] = [];

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    const inFrames = frames.includes(page);

    if (inFrames) {
      useOrder.splice(useOrder.indexOf(page), 1);
      useOrder.push(page);
      snapshots.push({
        step: i,
        page,
        frames: [...frames],
        isFault: false,
        replacedPage: null,
        explanation: `Page ${page} is in memory. Moved to most recently used.`,
      });
    } else {
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        useOrder.push(page);
        snapshots.push({
          step: i,
          page,
          frames: [...frames],
          isFault: true,
          replacedPage: null,
          explanation: `Page ${page} not found. Loaded into empty frame ${emptyIdx}.`,
        });
      } else {
        const lru = useOrder.shift()!;
        const idx = frames.indexOf(lru);
        frames[idx] = page;
        useOrder.push(page);
        snapshots.push({
          step: i,
          page,
          frames: [...frames],
          isFault: true,
          replacedPage: lru,
          explanation: `Page ${page} not found. Replaced page ${lru} (least recently used).`,
        });
      }
    }
  }
  return snapshots;
}

function simulateOptimal(refString: number[], frameCount: number): Snapshot[] {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const snapshots: Snapshot[] = [];

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    const inFrames = frames.includes(page);

    if (inFrames) {
      snapshots.push({
        step: i,
        page,
        frames: [...frames],
        isFault: false,
        replacedPage: null,
        explanation: `Page ${page} is already in memory. No fault.`,
      });
    } else {
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        snapshots.push({
          step: i,
          page,
          frames: [...frames],
          isFault: true,
          replacedPage: null,
          explanation: `Page ${page} not found. Loaded into empty frame ${emptyIdx}.`,
        });
      } else {
        // Find the page used farthest in the future
        let farthest = -1;
        let victimIdx = 0;
        for (let f = 0; f < frames.length; f++) {
          const nextUse = refString.indexOf(frames[f]!, i + 1);
          if (nextUse === -1) {
            victimIdx = f;
            break;
          }
          if (nextUse > farthest) {
            farthest = nextUse;
            victimIdx = f;
          }
        }
        const replacedPage = frames[victimIdx]!;
        frames[victimIdx] = page;
        snapshots.push({
          step: i,
          page,
          frames: [...frames],
          isFault: true,
          replacedPage,
          explanation: `Page ${page} not found. Replaced page ${replacedPage} (used farthest in future).`,
        });
      }
    }
  }
  return snapshots;
}

export function runSimulation(
  algorithm: Algorithm,
  refString: number[],
  frameCount: number
): SimulationResult {
  const simulators = { FIFO: simulateFIFO, LRU: simulateLRU, Optimal: simulateOptimal };
  const snapshots = simulators[algorithm](refString, frameCount);
  const totalFaults = snapshots.filter((s) => s.isFault).length;
  return {
    algorithm,
    snapshots,
    totalFaults,
    faultRate: refString.length > 0 ? totalFaults / refString.length : 0,
    referenceString: refString,
    frameCount,
  };
}

export function generateReferenceString(length: number, maxPage: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * maxPage));
}
