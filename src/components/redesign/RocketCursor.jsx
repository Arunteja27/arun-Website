import { useEffect, useRef } from 'react';
import './rocket-cursor.css';

const motionQuery = '(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)';
const textEntryTargets = 'input, textarea, [contenteditable]:not([contenteditable="false"])';
const controlTargets = 'a[href], button, label, select, summary, video[controls], [role="button"], [role="tab"]';
const streakCount = 14;
const streakSlots = Array.from({ length: streakCount }, (_, index) => index);

export default function RocketCursor() {
  const layerRef = useRef(null);
  const pointerRef = useRef(null);
  const craftRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const surface = layer.parentElement;
    const pointer = pointerRef.current;
    const craft = craftRef.current;
    const streaks = layer.querySelectorAll('.rocket-cursor-streak');
    const media = window.matchMedia(motionQuery);
    const flights = Array(streakCount);
    let streakIndex = 0;
    let lastEmission = -Infinity;
    let previous = null;
    let angle = Math.PI / 4;

    function clearRocket() {
      if (layer.hasAttribute('data-active')) {
        layer.removeAttribute('data-active');
        layer.removeAttribute('data-over-control');
        flights.forEach((flight) => flight.cancel());
      }
      previous = null;
    }

    function addStreak(x, y, time) {
      const slot = streakIndex;
      streakIndex = (streakIndex + 1) % streakCount;
      const directionX = Math.sin(angle);
      const directionY = -Math.cos(angle);
      const spread = (slot % 5 - 2) * 2.7;
      const startX = x - directionX * 21 - directionY * spread;
      const startY = y - directionY * 21 + directionX * spread;
      const endX = startX - directionX * 23 - directionY * spread;
      const endY = startY - directionY * 23 + directionX * spread;

      flights[slot]?.cancel();
      flights[slot] = streaks[slot].animate(
        [
          { transform: `translate3d(${startX}px, ${startY}px, 0) rotate(${angle}rad)`, opacity: 0.84 },
          { transform: `translate3d(${endX}px, ${endY}px, 0) rotate(${angle}rad) scale(0.32, 0.4)`, opacity: 0 },
        ],
        { duration: 240 + (slot % 3) * 28, easing: 'ease-out' },
      );
      lastEmission = time;
    }

    function trackRocket(event) {
      if (!media.matches || event.pointerType !== 'mouse' || document.fullscreenElement || event.target.closest(textEntryTargets)) {
        clearRocket();
        return;
      }

      const x = event.clientX;
      const y = event.clientY;

      if (previous) {
        const deltaX = x - previous.x;
        const deltaY = y - previous.y;

        if (Math.hypot(deltaX, deltaY) >= 3) {
          const turn = Math.atan2(deltaY, deltaX) + Math.PI / 2 - angle;
          angle += Math.atan2(Math.sin(turn), Math.cos(turn));
          previous = { x, y };

          if (event.timeStamp - lastEmission >= 19 && typeof streaks[0].animate === 'function') {
            addStreak(x, y, event.timeStamp);
          }
        }
      } else {
        previous = { x, y };
        angle = Math.PI / 4;
      }

      pointer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      craft.style.transform = `rotate(${angle}rad)`;
      layer.toggleAttribute('data-over-control', Boolean(event.target.closest(controlTargets)));
      if (!layer.hasAttribute('data-active')) layer.setAttribute('data-active', '');
    }

    surface.addEventListener('pointermove', trackRocket, { passive: true });
    surface.addEventListener('pointerleave', clearRocket);
    surface.addEventListener('pointercancel', clearRocket);
    media.addEventListener('change', clearRocket);
    document.addEventListener('fullscreenchange', clearRocket);
    document.addEventListener('visibilitychange', clearRocket);
    window.addEventListener('blur', clearRocket);

    return () => {
      clearRocket();
      surface.removeEventListener('pointermove', trackRocket);
      surface.removeEventListener('pointerleave', clearRocket);
      surface.removeEventListener('pointercancel', clearRocket);
      media.removeEventListener('change', clearRocket);
      document.removeEventListener('fullscreenchange', clearRocket);
      document.removeEventListener('visibilitychange', clearRocket);
      window.removeEventListener('blur', clearRocket);
    };
  }, []);

  return (
    <div className="rocket-cursor-layer" ref={layerRef} aria-hidden="true">
      <div className="rocket-cursor-trail">
        {streakSlots.map((slot) => <span className="rocket-cursor-streak" key={slot} />)}
      </div>
      <div className="rocket-cursor-pointer" ref={pointerRef}>
        <div className="rocket-cursor-craft" ref={craftRef}>
          <span className="rocket-cursor-hull" />
          <span className="rocket-cursor-window" />
        </div>
      </div>
    </div>
  );
}
