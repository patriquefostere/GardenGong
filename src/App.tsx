import { useEffect, useRef, useState } from "react";
import playBarTone from "./helpers/playBarTone.js";
import {
  barLengthFromFrequency,
  frequencyFromBarLength,
} from "./helpers/physicsConversions";
import { AddBarButton } from "./components/AddBarButton";
import { BarInfo } from "./components/BarInfo.js";
import { LengthInput } from "./components/LengthInput";
import { LengthSlider } from "./components/LengthSlider";
import { DeleteButton } from "./components/DeleteButton";
import { Bar } from "./components/Bar.js";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const AudioContextClass = window.AudioContext || window.webkitAudioContext;

export default function HarmonicBars() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    audioCtxRef.current = new AudioContextClass();
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const baseFrequency = 220; // Hz
  const baseLength = 320; // px

  const harmonics = [1, 4 / 3, 3 / 2, 2, 8 / 3, 3, 4];

  const [bars, setBars] = useState(() =>
    harmonics.map((ratio, i) => {
      const freq = baseFrequency * ratio;
      const length = barLengthFromFrequency(freq, baseFrequency, baseLength);
      return { id: i, length };
    }),
  );

  const nextId = useRef(bars.length);

  function addBar() {
    setBars((prev) => [...prev, { id: nextId.current++, length: baseLength }]);
  }

  function deleteBar(id: number) {
    setBars((prev) => prev.filter((bar) => bar.id !== id));
  }

  const updateBarLength = (id: number, length: number) => {
    setBars((prev) => prev.map((b) => (b.id === id ? { ...b, length } : b)));
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold mb-4">Glockenspiel Simulator</h1>

      <div className="flex flex-col gap-4">
        {bars.map((bar) => {
          const freq = frequencyFromBarLength(
            bar.length,
            baseFrequency,
            baseLength,
          );

          return (
            <div key={bar.id} className="flex flex-col gap-1">
              <Bar
                bar={bar}
                onClick={() => playBarTone(audioCtxRef.current, freq)}
              />

              <div className="flex items-center gap-2">
                <LengthSlider bar={bar} onChangeLength={updateBarLength} />
                <LengthInput bar={bar} onChangeLength={updateBarLength} />
                <DeleteButton id={bar.id} onDelete={deleteBar} />
              </div>

              <BarInfo bar={bar} freq={freq} />
            </div>
          );
        })}
      </div>

      <AddBarButton addBar={addBar} />

      <p className="text-sm text-zinc-400 mt-4 max-w-md text-center">
        Drag the sliders to change bar length. Pitch is recalculated using real
        vibrating-bar physics (frequency ∝ 1 / length²), not musical note
        tables.
      </p>
    </div>
  );
}
