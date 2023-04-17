import { Vec3 } from "../types";

export const normalise = (v: Vec3): Vec3 => {
  // TODO: implement normalisation
  return v;
};

export const scale = ([x, y, z]: Vec3, a: number) => {
  return [x * a, y * a, z * a] as Vec3;
};
