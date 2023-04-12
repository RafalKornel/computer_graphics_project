import { Matrix } from "./Matrix";
import { describe, it, expect } from "vitest";

describe("Matrix", () => {
  it("sets initial data", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    expect(m.matrix[0][0]).toBe(1);
    expect(m.matrix[0][1]).toBe(2);
    expect(m.matrix[1][0]).toBe(3);
    expect(m.matrix[1][1]).toBe(4);
  });

  it("calculates matrix rank", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    expect(m.rank).toBe(2);
  });

  it("multiplies by vector", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    const v = [1, 2];

    expect(m.multiplyVec(v)).toStrictEqual([5, 11]);
  });

  it("multiplies by another matrix", () => {
    const m1 = new Matrix([
      [1, 2],
      [3, 4],
    ]);

    const m2 = new Matrix([
      [5, 6],
      [7, 8],
    ]);

    const m1_dot_m2 = m1.multiplyMatrix(m2);

    expect(m1_dot_m2.rank).toBe(2);

    expect(m1_dot_m2.matrix[0]).toStrictEqual([19, 22]);
    expect(m1_dot_m2.matrix[1]).toStrictEqual([43, 50]);

    // inverse multiplication

    const m2_dot_m1 = m2.multiplyMatrix(m1);

    expect(m1_dot_m2.rank).toBe(2);

    expect(m2_dot_m1.matrix[0]).toStrictEqual([23, 34]);
    expect(m2_dot_m1.matrix[1]).toStrictEqual([31, 46]);
  });
});
