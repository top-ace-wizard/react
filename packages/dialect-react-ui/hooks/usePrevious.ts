import { useEffect, useRef } from 'react';

function usePrevious<T>(value: T) {
  const ref = useRef<T | null>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;
