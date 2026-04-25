export function frequencyFromBarLength(
  length: number,
  referenceFreq: number,
  referenceLength: number,
) {
  return referenceFreq * Math.pow(referenceLength / length, 2);
}

export function barLengthFromFrequency(
  freq: number,
  referenceFreq: number,
  referenceLength: number,
) {
  return referenceLength * Math.sqrt(referenceFreq / freq);
}
