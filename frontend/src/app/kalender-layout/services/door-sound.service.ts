import { Injectable } from '@angular/core';
import { CHRISTMAS_MELODIES, Melody, STILLE_NACHT, parseMelody } from './christmas-melodies';

/** Früher gespeicherte Stumm-Einstellung - der Ton ist nicht mehr abschaltbar, daher wird sie gelöscht. */
const LEGACY_MUTED_STORAGE_KEY = 'adventskalender.soundMuted';

/** Gesamtlautstärke (0..1) - bewusst eher leise. */
const MASTER_VOLUME = 0.35;

/** Lautstärke der Melodie relativ zur Gesamtlautstärke. */
const MELODY_VOLUME = 0.5;

/** Die Melodie beginnt, wenn das Knarren ausklingt (Sekunden nach dem Öffnen). */
const MELODY_DELAY = 1.1;

/** Instrumente für die Melodie - werden der Reihe nach abgewechselt. */
const MELODY_INSTRUMENTS = ['piano', 'glockenspiel'] as const;
type Instrument = (typeof MELODY_INSTRUMENTS)[number];

/** Lautstärke der Instrumente innerhalb der Melodie. */
const PIANO_LEVEL = 0.6;
const GLOCKENSPIEL_LEVEL = 0.35;

/** Vibrationsmuster in Millisekunden (vibrieren, Pause, vibrieren, ...). */
const VIBRATION = {
  open: [40, 60, 40],
  close: [30],
  win: [100, 60, 100, 60, 300],
  /** wie Glockenschläge */
  christmasEve: [250, 500, 250, 500, 250],
} as const;

/** Lautstärke der Kirchenglocken */
const BELL_LEVEL = 0.3;

/** Glockenschläge an Heiligabend: [Zeitpunkt in s, Frequenz] - zwei Glocken im Wechsel */
const CHURCH_BELL_STRIKES: readonly (readonly [number, number])[] = [
  [0, 392], // G4
  [0.8, 294], // D4
  [1.6, 392],
  [2.4, 294],
  [3.2, 392],
  [4.0, 294],
];

/** "Stille Nacht" beginnt, während die letzten Glockenschläge ausklingen. */
const CHURCH_BELLS_SECONDS = 5;

/** Gewinn-Fanfare: aufsteigender Dur-Dreiklang mit Wiederholung des Spitzentons. */
const FANFARE: Melody = {
  title: 'Gewinn-Fanfare',
  bpm: 160,
  notes: 'C4:0.5 E4:0.5 G4:0.5 C5:1.5 G4:0.5 C5:3',
};

/**
 * Erzeugt die Tür-Geräusche synthetisch mit der Web Audio API (keine Audiodateien nötig):
 * - Öffnen:  langes Knarren + Quietschen, danach eine Weihnachtsmelodie
 *            (abwechselnd auf Klavier und Glockenspiel) - bei noch verschlossenen
 *            Türen, die nur kurz aufgehen, ohne Melodie
 * - Schließen: kurzes Knarren + Quietschen + "Klack"
 * Zusätzlich vibriert das Handy (nur Android - iOS unterstützt keine Vibration im Browser).
 * Ton und Vibration sind immer an (kein Stumm-Schalter); leiser geht es nur über die
 * Lautstärke des Geräts.
 *
 * Browser (insbesondere iOS) erlauben Audio erst nach einer Nutzerinteraktion.
 * Der AudioContext wird daher beim ersten Antippen/Klick/Tastendruck entsperrt.
 */
@Injectable({ providedIn: 'root' })
export class DoorSoundService {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  /** Lautstärkeregler der gerade laufenden Melodie (zum Ausblenden beim Schließen). */
  private melodyBus: GainNode | null = null;
  private lastMelodyIndex = -1;
  private melodyCount = 0;

  constructor() {
    removeLegacyMutedSetting();

    // Audio bei jeder Nutzerinteraktion (wieder) freischalten, solange es nicht läuft.
    // Die Listener bleiben bewusst bestehen: iOS unterbricht den AudioContext z.B. beim
    // App-Wechsel oder Anruf ("interrupted") und erlaubt das Fortsetzen nur in einer Interaktion.
    const unlock = () => {
      if (this.ctx?.state === 'running') {
        return;
      }
      const ctx = this.context();
      if (ctx) {
        playSilence(ctx); // ältere iOS-Versionen schalten erst frei, wenn wirklich etwas abgespielt wird
      }
    };
    for (const type of UNLOCK_EVENTS) {
      document.addEventListener(type, unlock, { capture: true, passive: true });
    }
  }

  /**
   * Tür geht auf: langes Knarren mit Quietschen, danach eine zufällige Weihnachtsmelodie.
   * @param options.melody false = ohne Melodie (Tür eines zukünftigen Tages geht nur kurz auf)
   */
  playOpen(options: { melody: boolean } = { melody: true }): void {
    this.vibrate(VIBRATION.open);
    this.play((ctx, out, t) => {
      this.creak(ctx, out, t, { duration: 1.0, rateFrom: 16, rateTo: 42, gain: 0.55 });
      this.squeak(ctx, out, t + 0.05, { duration: 1.3, freqFrom: 720, freqTo: 1150, gain: 0.1 });
      if (options.melody) {
        this.melody(ctx, out, t + MELODY_DELAY);
      }
    });
  }

  /** Tür fällt zu: kürzeres Knarren, Quietschen und ein dumpfer "Klack" am Ende. */
  playClose(): void {
    this.vibrate(VIBRATION.close);
    this.play((ctx, out, t) => {
      this.stopMelody();
      this.creak(ctx, out, t, { duration: 0.45, rateFrom: 40, rateTo: 22, gain: 0.5 });
      this.squeak(ctx, out, t, { duration: 0.6, freqFrom: 1050, freqTo: 800, gain: 0.08 });
      this.knock(ctx, out, t + 0.6, 1);
    });
  }

  /** Gewinn! Kurze, festliche Fanfare (Klavier + Glockenspiel zusammen) und lange Vibration. */
  playFanfare(): void {
    this.vibrate(VIBRATION.win);
    this.play((ctx, out, t) => this.playTune(ctx, out, t, FANFARE, MELODY_INSTRUMENTS));
  }

  /**
   * Heiligabend: Kirchenglocken läuten, danach "Stille Nacht" (ganze erste Strophe)
   * auf dem Klavier.
   * @returns Gesamtdauer in Sekunden - 0, wenn kein Ton abgespielt werden kann (kein Web Audio)
   */
  playChristmasEve(): number {
    this.vibrate(VIBRATION.christmasEve);
    let duration = 0;
    this.play((ctx, out, t) => {
      const bus = this.newMelodyBus(ctx, out);
      CHURCH_BELL_STRIKES.forEach(([offset, freq]) => this.churchBell(ctx, bus, t + offset, freq));
      duration =
        CHURCH_BELLS_SECONDS +
        this.scheduleTune(ctx, bus, t + CHURCH_BELLS_SECONDS, STILLE_NACHT, ['piano']);
    });
    return duration;
  }

  /** Beendet laufende Musik (Melodie, Fanfare, Glocken, "Stille Nacht"). */
  stopMusic(): void {
    this.stopMelody();
  }

  // ---------------------------------------------------------------------------

  /** Kurze Vibration (Android). iOS/Desktop ohne Unterstützung: wird still ignoriert. */
  private vibrate(pattern: readonly number[]): void {
    if (typeof navigator.vibrate !== 'function') {
      return;
    }
    try {
      navigator.vibrate([...pattern]);
    } catch {
      // manche Browser werfen ohne vorherige Nutzerinteraktion
    }
  }

  private play(build: (ctx: AudioContext, out: AudioNode, t: number) => void): void {
    // iOS: Ton auch bei lautlos gestelltem iPhone abspielen. Erst hier (beim ersten echten
    // Tür-Geräusch) setzen, nicht schon beim Antippen der Seite - "playback" pausiert andere
    // Audio-Apps (z.B. Musik).
    setAudioSessionType('playback');
    const ctx = this.context();
    if (!ctx || !this.master) {
      return;
    }
    try {
      build(ctx, this.master, ctx.currentTime + 0.01);
    } catch (err) {
      console.warn('Tür-Geräusch konnte nicht abgespielt werden:', err);
    }
  }

  /** Erzeugt den AudioContext bei Bedarf bzw. setzt ihn fort (muss in einer Nutzerinteraktion passieren). */
  private context(): AudioContext | null {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        return null; // z.B. Testumgebung oder sehr alter Browser
      }
      this.ctx = new Ctor();

      // Kompressor verhindert Übersteuern, wenn mehrere Geräusche überlappen.
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.connect(this.ctx.destination);
      this.master = this.ctx.createGain();
      this.master.gain.value = MASTER_VOLUME;
      this.master.connect(compressor);

      // 1 Sekunde weißes Rauschen als Rohmaterial für Klopfen/Klicken.
      const length = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    // "suspended" (noch nicht freigeschaltet) oder "interrupted" (iOS: App-Wechsel, Anruf ...)
    if (this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
      this.ctx.resume().catch(() => {
        // ohne Nutzerinteraktion nicht erlaubt - nächste Interaktion versucht es erneut
      });
    }
    return this.ctx;
  }

  /**
   * Knarren = schnelle Folge von Reibe-Impulsen ("Stick-Slip") mit unregelmäßigem Takt,
   * gefiltert auf typische Holz-Resonanzen.
   */
  private creak(
    ctx: AudioContext,
    out: AudioNode,
    t: number,
    o: { duration: number; rateFrom: number; rateTo: number; gain: number }
  ): void {
    const end = t + o.duration;

    // Sägezahn mit niedriger Frequenz = Impulsfolge; Frequenz = Impulse pro Sekunde.
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const steps = Math.ceil(o.duration / 0.025);
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const rate = o.rateFrom + (o.rateTo - o.rateFrom) * p;
      osc.frequency.setValueAtTime(rate * (0.75 + Math.random() * 0.5), t + p * o.duration);
    }

    // Holz-Resonanzen
    const body = ctx.createGain();
    for (const [freq, q, level] of [
      [420, 6, 1.0],
      [980, 9, 0.7],
      [2300, 12, 0.35],
    ] as const) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq * (0.95 + Math.random() * 0.1);
      bp.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(bp).connect(g).connect(body);
    }

    // Lautstärke: einblenden, unregelmäßig "ruckeln", ausblenden.
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(o.gain, t + 0.06);
    for (let i = 1; i < steps - 1; i++) {
      const at = t + (i / steps) * o.duration;
      if (at > t + 0.06 && at < end - 0.1) {
        env.gain.setValueAtTime(o.gain * (0.55 + Math.random() * 0.45), at);
      }
    }
    env.gain.setValueAtTime(o.gain * 0.6, end - 0.1);
    env.gain.exponentialRampToValueAtTime(0.0001, end);

    body.connect(env).connect(out);
    osc.start(t);
    osc.stop(end + 0.05);
  }

  /** Quietschen = hoher, leicht schwankender Ton mit gleitender Tonhöhe. */
  private squeak(
    ctx: AudioContext,
    out: AudioNode,
    t: number,
    o: { duration: number; freqFrom: number; freqTo: number; gain: number }
  ): void {
    const end = t + o.duration;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(o.freqFrom, t);
    osc.frequency.exponentialRampToValueAtTime(o.freqTo, end);

    // Vibrato
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 6 + Math.random() * 4;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = o.freqFrom * 0.03;
    lfo.connect(lfoDepth).connect(osc.frequency);

    // An- und abschwellen, Höhepunkt in der Mitte.
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(o.gain, t + o.duration * 0.4);
    env.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(env).connect(out);
    osc.start(t);
    lfo.start(t);
    osc.stop(end + 0.05);
    lfo.stop(end + 0.05);
  }

  /** Dumpfes Klopfen (Holz auf Holz). */
  private knock(ctx: AudioContext, out: AudioNode, t: number, level: number): void {
    if (!this.noise) {
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 380 + Math.random() * 120;
    lp.Q.value = 4;
    const env = ctx.createGain();
    env.gain.setValueAtTime(level * 2.5, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    src.connect(lp).connect(env).connect(out);
    src.start(t, Math.random() * 0.5, 0.15);

    // tiefer "Körper" des Schlags
    const thump = ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(140, t);
    thump.frequency.exponentialRampToValueAtTime(70, t + 0.1);
    const thumpEnv = ctx.createGain();
    thumpEnv.gain.setValueAtTime(level * 0.6, t);
    thumpEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    thump.connect(thumpEnv).connect(out);
    thump.start(t);
    thump.stop(t + 0.12);
  }

  /** Spielt eine zufällig gewählte Weihnachtsmelodie - abwechselnd auf Klavier und Glockenspiel. */
  private melody(ctx: AudioContext, out: AudioNode, t: number): void {
    this.lastMelodyIndex = pickRandomIndex(CHRISTMAS_MELODIES.length, this.lastMelodyIndex);
    const melody = CHRISTMAS_MELODIES[this.lastMelodyIndex];
    const instrument: Instrument = MELODY_INSTRUMENTS[this.melodyCount++ % MELODY_INSTRUMENTS.length];
    this.playTune(ctx, out, t, melody, [instrument]);
  }

  /** Spielt eine Melodie auf einem oder mehreren Instrumenten gleichzeitig (ersetzt eine laufende Melodie). */
  private playTune(
    ctx: AudioContext,
    out: AudioNode,
    t: number,
    melody: Melody,
    instruments: readonly Instrument[]
  ): void {
    this.scheduleTune(ctx, this.newMelodyBus(ctx, out), t, melody, instruments);
  }

  /**
   * Neuer Lautstärkeregler für Musik (beendet laufende Musik). Alles, was darüber läuft,
   * lässt sich mit stopMelody() gemeinsam ausblenden.
   */
  private newMelodyBus(ctx: AudioContext, out: AudioNode): GainNode {
    this.stopMelody();
    const bus = ctx.createGain();
    bus.gain.value = MELODY_VOLUME;
    bus.connect(out);
    this.melodyBus = bus;
    return bus;
  }

  /** Plant die Noten einer Melodie ein. Liefert die Dauer in Sekunden. */
  private scheduleTune(
    ctx: AudioContext,
    bus: AudioNode,
    t: number,
    melody: Melody,
    instruments: readonly Instrument[]
  ): number {
    const notes = parseMelody(melody);
    let at = t;
    notes.forEach((note, i) => {
      if (note.frequency !== null) {
        for (const instrument of instruments) {
          if (instrument === 'glockenspiel') {
            this.glockenspielNote(ctx, bus, at, note.frequency);
          } else {
            this.pianoNote(ctx, bus, at, note.frequency, note.duration, i === notes.length - 1);
          }
        }
      }
      at += note.duration;
    });
    return at - t;
  }

  /**
   * Kirchenglocke: Glocken klingen nicht harmonisch - typisch sind der tiefe "Summton"
   * (halbe Frequenz), die kleine Terz (1,2-fach), die Quinte und die Oktave darüber.
   * Tiefe Teiltöne klingen sehr lange nach, hohe verklingen schnell.
   */
  private churchBell(ctx: AudioContext, out: AudioNode, t: number, freq: number): void {
    for (const [ratio, level, decay] of [
      [0.5, 0.45, 7], // Summton
      [1, 1, 5.5], // Grundton
      [1.2, 0.6, 4], // kleine Terz - macht den typischen "Glocken"-Klang
      [1.5, 0.35, 3.2], // Quinte
      [2, 0.5, 2.6], // Oktave ("Nominal")
      [2.5, 0.22, 1.8],
      [3, 0.15, 1.2],
      [4.2, 0.08, 0.6],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * ratio;
      // leichte Schwebung wie bei einer echten, nicht ganz symmetrischen Glocke
      osc.detune.value = (Math.random() - 0.5) * 6;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(level * BELL_LEVEL, t + 0.004);
      env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(env).connect(out);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    }
  }

  /**
   * Glockenspielton: Ein angeschlagener Metallstab schwingt nicht harmonisch wie eine Saite,
   * sondern mit Teiltönen beim 2,76-, 5,40- und 8,93-fachen des Grundtons, die sehr
   * schnell abklingen - übrig bleibt der klare, lang nachklingende Grundton.
   * Wie beim echten Instrument klingt es zwei Oktaven höher als notiert.
   */
  private glockenspielNote(ctx: AudioContext, out: AudioNode, t: number, notatedFreq: number): void {
    const freq = notatedFreq * 4;
    for (const [ratio, level, decay] of [
      [1, 1, 1.4],
      [2.76, 0.35, 0.3],
      [5.4, 0.18, 0.1],
      [8.93, 0.1, 0.04],
    ] as const) {
      const partial = freq * ratio;
      if (partial > 16000) {
        continue; // unhörbar bzw. Aliasing vermeiden
      }
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = partial;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(level * GLOCKENSPIEL_LEVEL, t + 0.001);
      env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(env).connect(out);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    }
  }

  /** Blendet eine laufende Melodie schnell aus. */
  private stopMelody(): void {
    const bus = this.melodyBus;
    const ctx = this.ctx;
    this.melodyBus = null;
    if (!bus || !ctx) {
      return;
    }
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(0, now + 0.15);
    setTimeout(() => bus.disconnect(), 300);
  }

  /**
   * Klavierton: mehrere Obertöne, leicht "gestreckt" wie bei echten Saiten (Inharmonizität),
   * hohe Obertöne klingen schneller ab, der Grundton ist doppelt und minimal verstimmt
   * (Schwebung wie bei mehreren Saiten pro Taste), dazu ein kurzer Hammeranschlag.
   * Beim Loslassen der Taste dämpft der Dämpfer den Ton - nur der letzte Ton klingt aus.
   */
  private pianoNote(
    ctx: AudioContext,
    out: AudioNode,
    t: number,
    freq: number,
    duration: number,
    isLast: boolean
  ): void {
    const inharmonicity = 0.0004;
    const ringTime = Math.min(3, 1.2 + 300 / freq); // tiefe Töne klingen länger
    const end = isLast ? t + ringTime : Math.min(t + ringTime, t + duration + 0.12);

    // Taste loslassen: Dämpfer
    const voice = ctx.createGain();
    voice.gain.setValueAtTime(PIANO_LEVEL, t);
    if (!isLast) {
      voice.gain.setValueAtTime(PIANO_LEVEL, Math.max(t, end - 0.1));
      voice.gain.linearRampToValueAtTime(0, end);
    }
    voice.connect(out);

    // Klang wird nach dem Anschlag schnell weicher
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.setValueAtTime(Math.min(freq * 10, 9000), t);
    tone.frequency.exponentialRampToValueAtTime(Math.min(freq * 3, 4000), t + 0.6);
    tone.connect(voice);

    const partialLevels = [1, 0.55, 0.3, 0.18, 0.1, 0.06];
    partialLevels.forEach((level, i) => {
      const n = i + 1;
      const partialFreq = n * freq * Math.sqrt(1 + inharmonicity * n * n);
      const decay = ringTime / (1 + 0.6 * i);
      const detunes = n === 1 ? [0, 1.5] : [0]; // Grundton doppelt (Schwebung)
      for (const detune of detunes) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = partialFreq;
        osc.detune.value = detune;
        const env = ctx.createGain();
        const peak = detune === 0 ? level : level * 0.5;
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(peak, t + 0.002);
        env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
        osc.connect(env).connect(tone);
        osc.start(t);
        osc.stop(Math.min(t + decay, end) + 0.05);
      }
    });

    // Hammeranschlag: kurzes, gefiltertes Rauschen
    if (this.noise) {
      const hammer = ctx.createBufferSource();
      hammer.buffer = this.noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = Math.min(freq * 4, 4000);
      bp.Q.value = 1;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.25, t);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      hammer.connect(bp).connect(env).connect(tone);
      hammer.start(t, Math.random() * 0.5, 0.04);
    }
  }
}

/**
 * Ereignisse, die als Nutzerinteraktion zählen und Audio freischalten dürfen.
 * Achtung: "pointerdown"/"touchstart" zählen bei Touch-Eingabe auf iOS NICHT - erst
 * "touchend" bzw. "click".
 */
const UNLOCK_EVENTS = ['touchend', 'click', 'keydown'] as const;

/**
 * Audio Session API (bisher nur Safari ab iOS 17 / macOS 14):
 * - "ambient":  Standard - der Stummschalter am iPhone schaltet den Ton ab, mischt mit anderer Musik
 * - "playback": Ton auch bei lautlos gestelltem iPhone, pausiert aber andere Audio-Wiedergabe
 * In anderen Browsern ohne Wirkung.
 */
function setAudioSessionType(type: 'ambient' | 'playback'): void {
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session && session.type !== type) {
    try {
      session.type = type;
    } catch {
      // ignorieren
    }
  }
}

/** Spielt einen unhörbaren, 1 Sample langen Ton (Freischalten von Audio auf älteren iOS-Versionen). */
function playSilence(ctx: AudioContext): void {
  try {
    const src = ctx.createBufferSource();
    src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    src.connect(ctx.destination);
    src.start(0);
  } catch {
    // ignorieren
  }
}

/** Zufälliger Index, aber nie zweimal hintereinander derselbe. */
export function pickRandomIndex(count: number, last: number): number {
  if (count <= 1) {
    return 0;
  }
  let index: number;
  do {
    index = Math.floor(Math.random() * count);
  } while (index === last);
  return index;
}

/** Entfernt die Stumm-Einstellung früherer Versionen (der Ton ist jetzt immer an). */
function removeLegacyMutedSetting(): void {
  try {
    localStorage.removeItem(LEGACY_MUTED_STORAGE_KEY);
  } catch {
    // ignorieren
  }
}
