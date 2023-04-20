import { Vec2 } from "../types";

export function interpolate([x1, y1]: Vec2, [x2, y2]: Vec2): Vec2[] {
  let points = [];

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx == 0) {
    return [];
  }

  const m = dy / dx;

  const x_start = dx > 0 ? x1 : x2;
  const x_end = dx > 0 ? x2 : x1;

  const y_start = dx > 0 ? y1 : y2;

  let y = y_start;

  for (let x = x_start; x <= x_end; x++) {
    y = y + m;
    points.push([x, Math.round(y)] as Vec2);
  }

  return points;
}
