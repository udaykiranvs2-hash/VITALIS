import { useEffect, useRef } from 'react';

function AmbientEffects() {
  const effectsRef = useRef(null);

  useEffect(() => {
    const updatePointer = (event) => {
      effectsRef.current?.style.setProperty('--pointer-x', `${event.clientX}px`);
      effectsRef.current?.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  return (
    <div className="ambient-effects" ref={effectsRef} aria-hidden="true">
      <div className="ambient-pointer-glow" />
    </div>
  );
}

export default AmbientEffects;
