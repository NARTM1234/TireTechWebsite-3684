import { useEffect, useRef } from "react";
export function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;
    let frame = 0;
    let x = 0; let y = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (glow.current) {
          glow.current.style.transform = `translate3d(${x - 210}px,${y - 210}px,0)`;
          glow.current.classList.add('visible');
        }
        frame = 0;
      });
    };
    const leave = () => glow.current?.classList.remove('visible');
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);
  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}