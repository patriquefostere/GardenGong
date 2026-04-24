import { useEffect, useRef, useState } from "react";
import playBarTone from './helpers/playBarTone'
// --- Audio helpers ---
const AudioContextClass = window.AudioContext || window.webkitAudioContext;

// --- Physics conversions ---
// f = f₀ * (L₀ / L)²

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

  const baseFrequency = 220; // Hz
  const baseLength = 320; // px

  const harmonics = [1, 4 / 3, 3 / 2, 2, 8 / 3, 3, 4];

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

  const nextId = useRef(bars.length);

  function addBar() {
    setBars((prev) => [
      ...prev,
      { id: nextId.current++, length: baseLength }
    ]);
  }

  function deleteBar(id) {
    setBars((prev) => prev.filter((bar) => bar.id !== id));
  }

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

              <div className="flex items-center gap-2">
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

                <input
                  type="number"
                  min={140}
                  max={380}
                  step={1}
                  value={Math.round(bar.length)}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!Number.isNaN(value)) {
                      setBars((prev) =>
                        prev.map((b) =>
                          b.id === bar.id
                            ? {
                                ...b,
                                length: Math.min(
                                  380,
                                  Math.max(140, value)
                                ),
                              }
                            : b
                        )
                      );
                    }
                  }}
                  className="w-20 px-2 py-1 text-black rounded"
                />

                <button
                  onClick={() => deleteBar(bar.id)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                  Delete
                </button>
              </div>

              <span className="text-xs text-zinc-400">
                Length: {Math.round(bar.length)} px · Frequency:{" "}
                {freq.toFixed(1)} Hz
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={addBar}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
      >
        Add Bar
      </button>

      <p className="text-sm text-zinc-400 mt-4 max-w-md text-center">
        Drag the sliders to change bar length. Pitch is recalculated
        using real vibrating-bar physics (frequency ∝ 1 / length²),
        not musical note tables.
      </p>
    </div>
  );
}