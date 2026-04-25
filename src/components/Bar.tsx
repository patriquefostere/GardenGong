import { BarInfo } from "../Types/BarInfo";

interface BarProps {
  bar: BarInfo;
  onClick: () => void;
}

export function Bar({ bar, onClick }: BarProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg shadow-inner"
      style={{
        width: `${bar.length}px`,
        height: "28px",
        background: "linear-gradient(180deg, #d6b36a, #8f6b2f)",
      }}
    />
  );
}
