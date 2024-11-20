export function calculateHeatIndex(temperature: number, humidity: number): number {
  const c1 = -8.78469475556;
  const c2 = 1.61139411;
  const c3 = 2.33854883889;
  const c4 = -0.14611605;
  const c5 = -0.012308094;
  const c6 = -0.0164248277778;
  const c7 = 0.002211732;
  const c8 = 0.00072546;
  const c9 = -0.000003582;

  const t2 = temperature ** 2;
  const rh2 = humidity ** 2;

  return (
    c1 +
    c2 * temperature +
    c3 * humidity +
    c4 * temperature * humidity +
    c5 * t2 +
    c6 * rh2 +
    c7 * t2 * humidity +
    c8 * temperature * rh2 +
    c9 * t2 * rh2
  );
}