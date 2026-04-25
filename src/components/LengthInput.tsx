import { useEffect, useState } from "react";
import { LengthInputProps } from "../Types/LengthInputProps";

export function LengthInput({ bar, onChangeLength }: LengthInputProps) {
  const [draft, setDraft] = useState(String(Math.round(bar.length)));

  // Keep local state in sync if bar changes externally
  useEffect(() => {
    setDraft(String(Math.round(bar.length)));
  }, [bar.length]);

  return (
    <input
      type="number"
      min={140}
      max={380}
      step={1}
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
      }}
      onBlur={() => {
        const value = Number(draft);
        if (!Number.isNaN(value)) {
          onChangeLength(bar.id, Math.min(380, Math.max(140, value)));
        }
      }}
      className="w-20 px-2 py-1 text-black rounded"
    />
  );
}
