import { useState, useEffect } from 'react';
import { DemoState, demoStateEmitter, DemoStateType } from './DemoState';

export function useDemoState(): DemoStateType {
  const [state, setState] = useState<DemoStateType>(DemoState);

  useEffect(() => {
    // Return the unsubscribe function directly
    return demoStateEmitter.subscribe(() => {
      // Create a shallow copy to trigger React re-render
      setState({ ...DemoState });
    });
  }, []);

  return state;
}
