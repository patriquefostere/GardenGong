import { Bar } from "./Bar";
export type LengthInputProps = {
  bar: Bar;
  onChangeLength: (id: number, length: number) => void;
};
