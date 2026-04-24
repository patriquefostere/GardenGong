
export default function playBarTone(audioCtx, fundamentalFreq) {
  if (!audioCtx) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.7, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

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