import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "public", "audio");
mkdirSync(outDir, { recursive: true });

const sampleRate = 22050;
const duration = 14;

function createTone(filename, base, pulse, seed) {
  const samples = sampleRate * duration;
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let noise = seed;
  for (let index = 0; index < samples; index += 1) {
    const time = index / sampleRate;
    const fade = Math.min(1, time / 1.2, (duration - time) / 1.2);
    const slow = 0.7 + 0.3 * Math.sin(Math.PI * 2 * pulse * time);
    const pad =
      Math.sin(Math.PI * 2 * base * time) * 0.2 +
      Math.sin(Math.PI * 2 * base * 1.5 * time + 0.8) * 0.105 +
      Math.sin(Math.PI * 2 * base * 2 * time + 1.7) * 0.055;
    noise = (noise * 1664525 + 1013904223) >>> 0;
    const hiss = ((noise / 4294967295) * 2 - 1) * 0.008;
    const value = Math.max(-1, Math.min(1, (pad * slow + hiss) * fade));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + index * 2);
  }

  writeFileSync(join(outDir, filename), buffer);
}

createTone("after-static.wav", 82.41, 0.115, 19);
createTone("soft-signal.wav", 98.0, 0.09, 47);
createTone("night-receiver.wav", 65.41, 0.075, 83);

console.log("Generated three original ambient demo tones in public/audio.");
