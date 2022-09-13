import { RefObject, useEffect, useRef } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  isListening: boolean,
  callback: () => void
) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const element = ref.current;

    if (!element || !isListening) {
      return;
    }

    function handleClick(event: MouseEvent | TouchEvent) {
      if (!element?.contains(event.target as HTMLElement)) {
        callbackRef.current();
      }
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [isListening, ref]);
}
