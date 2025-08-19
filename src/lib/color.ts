// Deterministic color selection utilities for labels (e.g., Space names)

export type ColorClasses = { bg: string; text: string };

// Palette taken from tag colors to keep visual coherence
const palette: Array<{ hex: `#${string}`; bg: string; text: string }> = [
  { hex: '#FF6B6B', bg: '!bg-[#FF6B6B]', text: 'text-white' },
  { hex: '#FFD93D', bg: '!bg-[#FFD93D]', text: 'text-black' },
  { hex: '#6BCB77', bg: '!bg-[#6BCB77]', text: 'text-black' },
  { hex: '#4D96FF', bg: '!bg-[#4D96FF]', text: 'text-white' },
  { hex: '#FF9F1C', bg: '!bg-[#FF9F1C]', text: 'text-black' },
  { hex: '#9D4EDD', bg: '!bg-[#9D4EDD]', text: 'text-white' },
  { hex: '#00B4D8', bg: '!bg-[#00B4D8]', text: 'text-black' },
  { hex: '#F72585', bg: '!bg-[#F72585]', text: 'text-white' },
  { hex: '#06D6A0', bg: '!bg-[#06D6A0]', text: 'text-black' },
  { hex: '#8D99AE', bg: '!bg-[#8D99AE]', text: 'text-black' },
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0; // 32-bit
  }
  return Math.abs(h);
}

export function colorForLabel(label: string | number | null | undefined): ColorClasses {
  const key = String(label ?? '');
  const idx = key ? hashString(key) % palette.length : 0;
  const { bg, text } = palette[idx];
  return { bg, text };
}
