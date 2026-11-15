import { useEffect, useRef, useState } from 'react';
import beachPortrait from '../../assets/beach-boi.png';
import costumePortrait from '../../assets/maybe0.jpg';
import './dither-portrait.css';

const WIDTH = 242;
const HEIGHT = 220;
const HOLD_MS = 3000;
const DISSOLVE_MS = 380;
const MORPH_MS = 640;
const SHOT_MS = HOLD_MS + DISSOLVE_MS * 2 + MORPH_MS;
const FRAME_INTERVAL_MS = 1000 / 30;
const photos = [
  {
    src: beachPortrait,
    width: 1086,
    height: 1448,
    positionY: 0.25,
    alt: 'Arun smiling at the beach with mountains and water behind him',
  },
  {
    src: costumePortrait,
    width: 715,
    height: 900,
    positionY: 0.17,
    alt: 'Arun wearing sunglasses, a long wig, and a fake beard',
  },
];
const BAYER = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
];
const WINE = [104, 37, 57];
const IVORY = [255, 240, 215];

function ditherPhoto(context, image, positionY) {
  const scale = Math.max(WIDTH / image.naturalWidth, HEIGHT / image.naturalHeight);
  const sourceWidth = WIDTH / scale;
  const sourceHeight = HEIGHT / scale;
  const cropLeft = (image.naturalWidth - sourceWidth) * 0.5;
  const cropTop = (image.naturalHeight - sourceHeight) * positionY;
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.drawImage(
    image, cropLeft, cropTop, sourceWidth, sourceHeight, 0, 0, WIDTH, HEIGHT,
  );

  const { data } = context.getImageData(0, 0, WIDTH, HEIGHT);
  const ivory = new Uint8Array(WIDTH * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const pixel = y * WIDTH + x;
      const index = pixel * 4;
      const rank = (BAYER[y % 8][x % 8] + 0.5) / 64;
      const luma = (data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255;
      ivory[pixel] = luma > rank;
    }
  }
  return ivory;
}

function prepareTransition(context, images) {
  const pixels = images.map((image, index) => ditherPhoto(context, image, photos[index].positionY));
  const dissolveAt = new Float32Array(WIDTH * HEIGHT);
  const morphAt = new Float32Array(WIDTH * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const pixel = y * WIDTH + x;
      const rank = (BAYER[y % 8][x % 8] + 0.5) / 64;
      // A diagonal sweep keeps the edge of the photo dissolve stippled.
      dissolveAt[pixel] = (x / WIDTH) * 0.64 + (y / HEIGHT) * 0.13 + rank * 0.23;
      // A separate pattern interleaves the dithered portraits across the whole frame.
      const morphRank = (BAYER[(y + 3) % 8][(x + 5) % 8] + 0.5) / 64;
      morphAt[pixel] = (1 - y / HEIGHT) * 0.32 + (x / WIDTH) * 0.19 + morphRank * 0.49;
    }
  }

  return { pixels, dissolveAt, morphAt, frame: context.createImageData(WIDTH, HEIGHT) };
}

export default function DitherPortrait() {
  const portraitRef = useRef(null);
  const beachImageRef = useRef(null);
  const costumeImageRef = useRef(null);
  const canvasRef = useRef(null);
  const toggleRef = useRef(null);
  const [loadCostume, setLoadCostume] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const portraitElement = portraitRef.current;
    const beachImage = beachImageRef.current;
    const costumeImage = costumeImageRef.current;
    const images = [beachImage, costumeImage];
    beachImage.fetchPriority = 'high';
    costumeImage.fetchPriority = 'low';
    const canvas = canvasRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let context;
    let transition;
    let accumulatedTime = 0;
    let resumedAt = null;
    let animationFrame = 0;
    let phaseTimer = 0;
    let lastDrawTime = -Infinity;
    let visiblePhoto = 0;
    let manuallyPaused = false;
    let inView = !('IntersectionObserver' in window);
    let observer;

    function showPhoto(index) {
      if (visiblePhoto !== index) {
        visiblePhoto = index;
        setActivePhoto(index);
      }
    }

    function drawFrame(from, to, morph, coverage) {
      const { frame, pixels, dissolveAt, morphAt } = transition;
      const fromPixels = pixels[from];
      const toPixels = pixels[to];
      for (let pixel = 0; pixel < dissolveAt.length; pixel += 1) {
        const index = pixel * 4;
        const shade = (morphAt[pixel] < morph ? toPixels : fromPixels)[pixel] ? IVORY : WINE;
        frame.data[index] = shade[0];
        frame.data[index + 1] = shade[1];
        frame.data[index + 2] = shade[2];
        frame.data[index + 3] = dissolveAt[pixel] < coverage ? 255 : 0;
      }

      context.putImageData(frame, 0, 0);
      canvas.hidden = false;
    }

    function animate(now) {
      if (resumedAt === null) return;
      const elapsed = accumulatedTime + now - resumedAt;
      const from = Math.floor(elapsed / SHOT_MS) % photos.length;
      const to = (from + 1) % photos.length;
      const shotTime = elapsed % SHOT_MS;

      if (shotTime < HOLD_MS) {
        showPhoto(from);
        canvas.hidden = true;
        phaseTimer = window.setTimeout(() => {
          animationFrame = requestAnimationFrame(animate);
        }, HOLD_MS - shotTime);
        return;
      }

      if (now - lastDrawTime >= FRAME_INTERVAL_MS) {
        const transitionTime = shotTime - HOLD_MS;
        if (transitionTime < DISSOLVE_MS) {
          drawFrame(from, from, 0, transitionTime / DISSOLVE_MS);
        } else if (transitionTime < DISSOLVE_MS + MORPH_MS) {
          // The canvas is opaque while the photo underneath changes.
          showPhoto(to);
          drawFrame(from, to, (transitionTime - DISSOLVE_MS) / MORPH_MS, 1);
        } else {
          showPhoto(to);
          drawFrame(to, to, 1, (SHOT_MS - shotTime) / DISSOLVE_MS);
        }
        lastDrawTime = now;
      }
      animationFrame = requestAnimationFrame(animate);
    }

    function pauseClock() {
      if (resumedAt === null) return;
      accumulatedTime += performance.now() - resumedAt;
      resumedAt = null;
      window.clearTimeout(phaseTimer);
      cancelAnimationFrame(animationFrame);
    }

    function updatePlayback() {
      if (preference.matches || !transition || manuallyPaused || !inView || document.hidden) {
        pauseClock();
        return;
      }
      if (resumedAt === null) {
        resumedAt = performance.now();
        animate(resumedAt);
      }
    }

    function preparePortrait() {
      if (preference.matches) {
        pauseClock();
        accumulatedTime = 0;
        showPhoto(0);
        canvas.hidden = true;
        setCanAnimate(false);
        return;
      }
      setLoadCostume(true);
      if (!transition && images.every((image) => image.complete && image.naturalWidth)) {
        context = canvas.getContext('2d');
        if (context) transition = prepareTransition(context, images);
      }
      setCanAnimate(Boolean(transition));
      updatePlayback();
    }

    if (!inView) {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.intersectionRatio >= 0.5;
        updatePlayback();
      }, { threshold: 0.5 });
      observer.observe(portraitElement);
    }

    toggleRef.current = () => {
      manuallyPaused = !manuallyPaused;
      setPaused(manuallyPaused);
      updatePlayback();
    };
    preference.addEventListener('change', preparePortrait);
    document.addEventListener('visibilitychange', updatePlayback);
    images.forEach((image) => image.addEventListener('load', preparePortrait));
    preparePortrait();

    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', preparePortrait);
      document.removeEventListener('visibilitychange', updatePlayback);
      images.forEach((image) => image.removeEventListener('load', preparePortrait));
      toggleRef.current = null;
      pauseClock();
      canvas.hidden = true;
    };
  }, []);

  const controlLabel = paused ? 'Play portrait animation' : 'Pause portrait animation';
  return (
    <div className="dither-portrait" ref={portraitRef}>
      <div className="dither-portrait__stage">
        {photos.map(({ src, width, height, positionY, alt }, index) => (
          <img
            key={src}
            ref={index === 0 ? beachImageRef : costumeImageRef}
            className="dither-portrait__image"
            src={index === 0 || loadCostume ? src : undefined}
            width={width}
            height={height}
            alt={alt}
            style={{ objectPosition: `50% ${positionY * 100}%` }}
            hidden={activePhoto !== index}
          />
        ))}
        <canvas
          ref={canvasRef}
          className="dither-portrait__canvas"
          width={WIDTH}
          height={HEIGHT}
          aria-hidden="true"
          hidden
        />
      </div>
      {canAnimate && (
        <button
          className="dither-portrait__toggle"
          type="button"
          aria-label={controlLabel}
          title={controlLabel}
          onClick={() => toggleRef.current?.()}
        >
          <span className={paused ? 'dither-portrait__play' : 'dither-portrait__pause'} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
