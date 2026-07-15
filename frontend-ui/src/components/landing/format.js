export const formatCompact = (value) => {
  if (value >= 100000) return `${Math.floor(value / 1000)}k+`;
  if (value >= 10000) return `${(value / 1000).toFixed(0)}k+`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`;
  return `${value}+`;
};
