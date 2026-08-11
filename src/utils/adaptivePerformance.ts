// Adaptive Performance Engine for Image Latency Throttling & Memory Optimization
export interface AdaptivePerformanceState {
  isLowPerfMode: boolean;
  isSlowNetworkMode: boolean;
  isLowEndHardware: boolean;
  highLatencyDetected: boolean;
  averageLatencyMs: number;
  lazyRootMargin: string;
  imageOptimizeMax: number;
  visibleBatchSize: number;
  adaptiveModeLabel: string;
}

const LATENCY_SAMPLES: number[] = [];
const MAX_SAMPLES = 12;

type PerformanceChangeListener = (state: AdaptivePerformanceState) => void;
const listeners = new Set<PerformanceChangeListener>();

function detectCapabilities() {
  let isSlowNetwork = false;
  let isLowHardware = false;

  if (typeof navigator !== "undefined") {
    // Check Network Connection API (2G / 3G / saveData)
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      if (conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.effectiveType === "3g") {
        isSlowNetwork = true;
      }
    }

    // Check Hardware specs
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      isLowHardware = true;
    }
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
      isLowHardware = true;
    }
  }

  return { isSlowNetwork, isLowHardware };
}

let { isSlowNetwork: isSlowNetworkMode, isLowHardware: isLowEndHardware } = detectCapabilities();
let highLatencyDetected = false;

function computeState(): AdaptivePerformanceState {
  const isLowPerfMode = isSlowNetworkMode || isLowEndHardware || highLatencyDetected;
  
  const averageLatencyMs = LATENCY_SAMPLES.length > 0
    ? Math.round(LATENCY_SAMPLES.reduce((a, b) => a + b, 0) / LATENCY_SAMPLES.length)
    : 0;

  return {
    isLowPerfMode,
    isSlowNetworkMode,
    isLowEndHardware,
    highLatencyDetected,
    averageLatencyMs,
    lazyRootMargin: isLowPerfMode ? "180px" : "650px", // Shrink prefetch margin on slow/low-end devices to conserve DOM & memory
    imageOptimizeMax: isLowPerfMode ? 600 : 1200,    // Downscale max resolution cap
    visibleBatchSize: isLowPerfMode ? 24 : 50,       // Reduce initial DOM nodes count
    adaptiveModeLabel: isLowPerfMode
      ? (isSlowNetworkMode ? "慢速網絡省流模式" : highLatencyDetected ? "高延遲智慧降頻" : "極速輕量模式")
      : "高效能畫質模式"
  };
}

let currentState = computeState();

function notifyListeners() {
  currentState = computeState();
  listeners.forEach(fn => fn(currentState));
}

/**
 * Feeds real-time image load latency into the Adaptive Performance Engine
 */
export function recordImageLoadLatency(loadTimeMs: number) {
  if (loadTimeMs <= 0) return;

  LATENCY_SAMPLES.push(loadTimeMs);
  if (LATENCY_SAMPLES.length > MAX_SAMPLES) {
    LATENCY_SAMPLES.shift();
  }

  const avg = LATENCY_SAMPLES.reduce((a, b) => a + b, 0) / LATENCY_SAMPLES.length;
  
  // Trigger adaptive throttling if recent average image load latency exceeds 1800ms
  // or if 3 recent loads took > 2500ms
  const slowCount = LATENCY_SAMPLES.filter(t => t > 2500).length;
  const shouldBeHighLatency = (LATENCY_SAMPLES.length >= 3 && avg > 1800) || slowCount >= 3;

  if (shouldBeHighLatency !== highLatencyDetected) {
    highLatencyDetected = shouldBeHighLatency;
    notifyListeners();
  }
}

export function getAdaptiveConfig(): AdaptivePerformanceState {
  return currentState;
}

export function subscribeAdaptivePerformance(listener: PerformanceChangeListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
