import React, { useEffect, useRef, useState } from "react";

// --- Audio helpers ---
const AudioContextClass = window.AudioContext || window.webkitAudioContext;

function playBarTone(audioCtx, fundamentalFreq) {
  if (!audioCtx) return;

  // Some browsers need a resumed context after user interaction
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  // Gain envelope (quick attack, natural decay)
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.7, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

  // Inharmonic partials (approximate metal bars)
  const partials = [1, 2.76, 5.4, 8.93];

  partials.forEach((ratio, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(fundamentalFreq * ratio, now);

    const partialGain = audioCtx.createGain();
    partialGain.gain.value = 1 / (i + 1.5);

    osc.connect(partialGain).connect(gain);
    osc.start(now);
    osc.stop(now + 3);
  });

  gain.connect(audioCtx.destination);
}

// --- Physics-inspired conversions ---
// Vibrating bar relationship:
//   f ∝ 1 / L²
// Inverted form used here:
//   f = f₀ * (L₀ / L)²

function frequencyFromBarLength(length, referenceFreq, referenceLength) {
  return referenceFreq * Math.pow(referenceLength / length, 2);
}

function barLengthFromFrequency(freq, referenceFreq, referenceLength) {
  return referenceLength * Math.sqrt(referenceFreq / freq);
}

export default function HarmonicBars() {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    audioCtxRef.current = new AudioContextClass();
    return () => audioCtxRef.current?.close();
  }, []);

  // Base reference (longest bar)
  const baseFrequency = 220; // Hz
  const baseLength = 320; // px

  // Initial harmonic ratios (starting tuning only)
  const harmonics = [1, 4 / 3, 3 / 2, 2, 8 / 3, 3, 4];

  // Length is now the source of truth
  const [bars, setBars] = useState(() =>
    harmonics.map((ratio, i) => {
      const freq = baseFrequency * ratio;
      const length = barLengthFromFrequency(
        freq,
        baseFrequency,
        baseLength
      );

      return { id: i, length };
    })
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Adjustable Harmonic Bar Instrument
      </h1>

      <div className="flex flex-col gap-4">
        {bars.map((bar) => {
          const freq = frequencyFromBarLength(
            bar.length,
            baseFrequency,
            baseLength
          );

          return (
            <div key={bar.id} className="flex flex-col gap-1">
              <div
                onClick={() =>
                  playBarTone(audioCtxRef.current, freq)
                }
                className="cursor-pointer rounded-lg shadow-inner"
                style={{
                  width: `${bar.length}px`,
                  height: "28px",
                  background:
                    "linear-gradient(180deg, #d6b36a, #8f6b2f)",
                }}
              />

              <input
                type="range"
                min={140}
                max={380}
                value={bar.length}
                onChange={(e) =>
                  setBars((prev) =>
                    prev.map((b) =>
                      b.id === bar.id
                        ? { ...b, length: Number(e.target.value) }
                        : b
                    )
                  )
                }
              />

              <span className="text-xs text-zinc-400">
                Length: {Math.round(bar.length)} px · Frequency:{" "}
                {freq.toFixed(1)} Hz
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-zinc-400 mt-6 max-w-md text-center">
        Drag the sliders to change bar length. Pitch is recalculated
        using real vibrating-bar physics (frequency ∝ 1 / length²),
        not musical note tables.
      </p>
    </div>
  );
}