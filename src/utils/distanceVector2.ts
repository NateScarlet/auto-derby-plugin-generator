/** distance between points */
export default function distanceVector2(...points: [number, number][]): number {
  let ret = 0;
  for (let i = 1; i < points.length; i += 1) {
    const pa = points[i - 1];
    const pb = points[i];
    ret += Math.sqrt((pa[0] - pb[0]) ** 2 + (pa[1] - pb[1]) ** 2);
  }
  return ret;
}
