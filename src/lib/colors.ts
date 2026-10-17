const NAMED: Record<string, string> = {
  red: "#8b1e1e",
  maroon: "#6b1c23",
  ruby: "#7a1f2b",
  wine: "#5c1220",
  rust: "#8a3a22",
  gold: "#c4a35a",
  ivory: "#f6f1e4",
  cream: "#efe6d2",
  beige: "#d8cbb8",
  forest: "#284232",
  green: "#2f4a38",
  teal: "#2a5a54",
  black: "#1a1a1a",
  white: "#f7f4ee",
  pink: "#d4a0a8",
  rose: "#c47a86",
  peach: "#e0b4a0",
  coral: "#c45c54",
  blue: "#1e3a5f",
  navy: "#152a45",
  yellow: "#d4b44a",
  orange: "#c45a28",
  purple: "#4a2d5a",
  silver: "#c0c0b8",
  grey: "#6a6a64",
  gray: "#6a6a64",
  brown: "#5c3a28",
  mustard: "#b0892e",
  magenta: "#8a2458",
};

export function normalizeHex(raw?: string | null) {
  const h = String(raw ?? "").trim();
  if (/^#([0-9a-f]{6})$/i.test(h)) return h.toLowerCase();
  if (/^#([0-9a-f]{3})$/i.test(h)) {
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`.toLowerCase();
  }
  return null;
}

export function swatchHex(color?: string | null, hex?: string | null) {
  const fromHex = normalizeHex(hex);
  if (fromHex) return fromHex;
  const key = String(color ?? "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  for (const [name, value] of Object.entries(NAMED)) {
    if (key.includes(name)) return value;
  }
  return "#284232";
}

export function contrastInk(hex: string) {
  const h = (normalizeHex(hex) ?? "#284232").slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return luma > 160 ? "#1a241c" : "#f6f1e4";
}

export function variantLabel(v: { name?: string | null; color?: string | null }) {
  return (v.color || v.name || "Colour").trim();
}

export function lineWithColor(productName: string, color?: string | null) {
  const c = color?.trim();
  if (!c || c.toLowerCase() === "default") return productName;
  if (productName.toLowerCase().includes(c.toLowerCase())) return productName;
  return `${productName} · ${c}`;
}
