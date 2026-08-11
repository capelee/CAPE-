import { useState, useEffect } from "react";
import { getAdaptiveConfig, subscribeAdaptivePerformance, AdaptivePerformanceState } from "../utils/adaptivePerformance";

export function useAdaptivePerformance(): AdaptivePerformanceState {
  const [state, setState] = useState<AdaptivePerformanceState>(getAdaptiveConfig);

  useEffect(() => {
    const unsubscribe = subscribeAdaptivePerformance(setState);
    return unsubscribe;
  }, []);

  return state;
}
