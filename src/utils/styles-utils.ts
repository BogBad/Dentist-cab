const chartColors = [
  '#FF5733', // Vibrant Red-Orange
  '#33FF57', // Lime Green
  '#5733FF', // Deep Purple
  '#FFC300', // Bright Yellow
  '#FF33FF', // Hot Pink
  '#33C1FF', // Sky Blue
  '#C70039', // Crimson
  '#900C3F', // Dark Maroon
  '#DAF7A6', // Light Green
  '#581845', // Deep Plum
  '#FF5733', // Coral
  '#8E44AD', // Violet
  '#2980B9', // Steel Blue
  '#1ABC9C', // Aqua
  '#F39C12', // Amber
  '#E74C3C', // Fire Red
  '#2ECC71', // Emerald
  '#3498DB', // Azure
  '#9B59B6', // Lavender
  '#34495E', // Slate Gray
];

export const getColorByString = (
  doctorId: string,
  opacity: number = 1
): string => {
  let hash = 0;
  for (let i = 0; i < doctorId.length; i++) {
    hash = doctorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % chartColors.length;
  const hex = chartColors[colorIndex];

  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
