import { Matrix } from "../Matrix";

const getYRotationMatrix = (angle: number) =>
  new Matrix([
    [Math.cos(angle), 0, Math.sin(angle)],
    [0, 1, 0],
    [-Math.sin(angle), 0, Math.cos(angle)],
  ]);

const getXRotationMatrix = (angle: number) =>
  new Matrix([
    [1, 0, 0],
    [0, Math.cos(angle), -Math.sin(angle)],
    [0, Math.sin(angle), Math.cos(angle)],
  ]);

const getZRotationMatrix = (angle: number) =>
  new Matrix([
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1],
  ]);

export const ROTATION_MATRIX = {
  x: getXRotationMatrix,
  y: getYRotationMatrix,
  z: getZRotationMatrix,
};
