import { Vec3 } from "../types";

export const normalise = (v: Vec3): Vec3 => {
  // TODO: implement normalisation
  return v;
};

export const scale = ([x, y, z]: Vec3, a: number) => {
  return [x * a, y * a, z * a] as Vec3;
};

export const dist = (v1: Vec3, v2: Vec3): number => {
  return Math.sqrt(
    (v1[0] - v2[0]) ** 2 + (v1[1] - v2[1]) ** 2 + (v1[2] - v2[2]) ** 2
  );
};
