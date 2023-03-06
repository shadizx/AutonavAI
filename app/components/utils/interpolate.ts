export function interpolate(left: number, right: number, percent: number) {
  return left + (right - left) * percent;
}
