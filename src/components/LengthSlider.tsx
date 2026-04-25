import { LengthInputProps } from "../Types/LengthInputProps";

export function LengthSlider({ bar, onChangeLength }: LengthInputProps) {
  return (
    <input
      type="range"
      min={140}
      max={380}
      value={bar.length}
      onChange={(e) => onChangeLength(bar.id, Number(e.target.value))}
    />
  );
}
