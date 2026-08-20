export const getColorString = (color: [number, number, number]) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

export const rgbToHex = (color: [number, number, number]): string => {
  return `#${color.map((channel) => {
    const value = Math.max(0, Math.min(255, Math.round(channel)));
    return value.toString(16).padStart(2, '0');
  }).join('')}`;
};

export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};
