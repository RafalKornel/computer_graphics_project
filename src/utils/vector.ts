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

export const cross = (v1: Vec3, v2: Vec3): Vec3 => {
  const x = v1[1] * v2[2] - v1[2] * v2[1];
  const y = v1[2] * v2[0] - v1[0] * v2[2];
  const z = v1[0] * v2[1] - v1[1] * v2[0];

  return [x, y, z] as Vec3;
};

export const dot = (v1: Vec3, v2: Vec3): number => {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
};
