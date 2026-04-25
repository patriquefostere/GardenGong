import { BarInfo } from "./BarInfo";
export type LengthInputProps = {
  bar: BarInfo;
  onChangeLength: (id: number, length: number) => void;
};
