import { Injectable } from '@angular/core';

/** Farben: Lions-Gelb, Lions-Blau, Weihnachtsrot, Tannengrün, Weiß */
const COLORS = ['#f9c910', '#2a4a82', '#c62828', '#2e7d32', '#ffffff', '#fad134'];
/** Konfetti pro Salve aus den beiden "Kanonen" unten links/rechts */
const CANNON_PARTICLES = 220;
/** Zeitpunkte der Salven (ms nach Start) */
const CANNON_SALVOS_MS = [0, 700];
/** Konfettiregen von oben über die ganze Breite */
const RAIN_PARTICLES = 200;
const RAIN_START_MS = 400;
const DURATION_MS = 7000;

interface Particle {
  /** erst ab diesem Zeitpunkt (ms) sichtbar und in Bewegung */
  delay: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  shape: 'rect' | 'star';
}

/**
 * Leichtgewichtiges Konfetti auf einem bildschirmfüllenden Canvas (ohne externe Bibliothek).
 * Wird bei "Bewegung reduzieren" (Systemeinstellung) nicht angezeigt.
 */
@Injectable({ providedIn: 'root' })
export class ConfettiService {
  burst(): void {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '10000',
    });
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];

    // Zwei "Kanonen" unten links und rechts schießen schräg nach oben zur Mitte - mehrere Salven
    for (const delay of CANNON_SALVOS_MS) {
      for (let i = 0; i < CANNON_PARTICLES; i++) {
        const fromLeft = i % 2 === 0;
        const angle = (fromLeft ? -60 : -120) * (Math.PI / 180) + (Math.random() - 0.5) * 0.7;
        const speed = 10 + Math.random() * 11;
        particles.push(
          createParticle(delay + Math.random() * 150, fromLeft ? 0 : width, height * 0.85, angle, speed)
        );
      }
    }

    // Konfettiregen von oben über die ganze Breite
    for (let i = 0; i < RAIN_PARTICLES; i++) {
      const delay = RAIN_START_MS + Math.random() * 1800;
      particles.push(createParticle(delay, Math.random() * width, -20, Math.PI / 2, 1 + Math.random() * 2));
    }

    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);
      // gegen Ende ausblenden
      ctx.globalAlpha = Math.max(0, Math.min(1, (DURATION_MS - elapsed) / 1000));

      for (const p of particles) {
        if (elapsed < p.delay || p.y > height + 40) {
          continue; // noch nicht gestartet bzw. schon unten aus dem Bild
        }
        p.vy += 0.25; // Schwerkraft
        p.vx *= 0.99; // Luftwiderstand
        p.vy = Math.min(p.vy, 5); // langsames Herabsegeln
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.8;
        p.y += p.vy;
        p.rotation += p.spin;
        draw(ctx, p);
      }

      if (elapsed < DURATION_MS) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    };
    requestAnimationFrame(frame);
  }
}

function createParticle(delay: number, x: number, y: number, angle: number, speed: number): Particle {
  return {
    delay,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.3,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() < 0.25 ? 'star' : 'rect',
  };
}

function draw(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  if (p.shape === 'star') {
    star(ctx, p.size * 0.7);
  } else {
    // Papierstreifen, "flattert" durch wechselnde Höhe
    ctx.fillRect(-p.size / 2, (-p.size / 4) * Math.abs(Math.cos(p.wobble)), p.size, (p.size / 2) * Math.abs(Math.cos(p.wobble)) + 1);
  }
  ctx.restore();
}

function star(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.fill();
}
