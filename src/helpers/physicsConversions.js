export function frequencyFromBarLength(length, referenceFreq, referenceLength) {
  return referenceFreq * Math.pow(referenceLength / length, 2);
}

export function barLengthFromFrequency(freq, referenceFreq, referenceLength) {
  return referenceLength * Math.sqrt(referenceFreq / freq);
}