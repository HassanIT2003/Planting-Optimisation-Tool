export function parseNumber(value: string): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}
