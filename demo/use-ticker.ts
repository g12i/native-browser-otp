import { useSyncExternalStore } from "react";

const createStore = () => {
  type Listener = (timeLeft: number) => void;
  let _lastState: number | undefined = undefined;

  const getState = () => 30 - (Math.floor(Date.now() / 1000) % 30);

  const listeners = new Set<Listener>();

  const notify = () => {
    const current = getState();
    if (current === _lastState) {
      return;
    }
    for (const listener of listeners) {
      listener(current);
    }
    _lastState = current;
  };

  let requestId: number | undefined = undefined;

  const loop = () => {
    requestId = undefined;
    notify();
    start();
  };

  const start = () => {
    if (!requestId) {
      requestId = requestAnimationFrame(loop);
    }
  };

  const stop = () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    start();
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        stop();
      }
    };
  };

  return { getState, subscribe };
};

const store = createStore();

export const useTicker = (): number => {
  const current = useSyncExternalStore(store.subscribe, store.getState);

  return current;
};
