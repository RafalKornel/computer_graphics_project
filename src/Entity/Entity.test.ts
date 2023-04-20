import { describe, expect, it } from "vitest";
import { Vec3 } from "../types";
import { CoordinateSystem } from "../Scene/CoordinateSystem";
import { Entity } from "./Entity";

describe("Entity", () => {
  it("should store position", () => {
    const e = new Entity({ position: [1, 1, 1] });

    expect(e.position).toStrictEqual([1, 1, 1]);
  });

  it("should store local coordinate syste", () => {
    const e = new Entity({
      localCoordinateSystem: new CoordinateSystem(
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ),
    });

    expect(e.localCoordinateSystem.x).toStrictEqual([1, 0, 0]);
    expect(e.localCoordinateSystem.y).toStrictEqual([0, 1, 0]);
    expect(e.localCoordinateSystem.z).toStrictEqual([0, 0, 1]);
  });

  it("should transform to local coordinate system", () => {
    const deg45 = -Math.PI / 4;

    const coordinateSystemRotatedByDeg45 = new CoordinateSystem(
      [Math.cos(deg45), 0, Math.sin(deg45)],
      [0, 1, 0],
      [-Math.sin(deg45), 0, Math.cos(deg45)]
    );

    const e = new Entity({
      position: [0, 1, 0],
      localCoordinateSystem: coordinateSystemRotatedByDeg45,
    });

    const point: Vec3 = [1, 0, 0];

    const pointLocal = e.transformVecToLocalSystem(point);

    const assertValue = [0.7071067812, 1, 0.7071067812];

    expect(Math.abs(pointLocal[0] - assertValue[0])).toBeLessThanOrEqual(1e-3);
    expect(Math.abs(pointLocal[1] - assertValue[1])).toBeLessThanOrEqual(1e-3);
    expect(Math.abs(pointLocal[2] - assertValue[2])).toBeLessThanOrEqual(1e-3);
  });

  it("should transform to world coordinate system", () => {
    const deg45 = -Math.PI / 4;

    const coordinateSystemRotatedByDeg45 = new CoordinateSystem(
      [Math.cos(deg45), 0, Math.sin(deg45)],
      [0, 1, 0],
      [-Math.sin(deg45), 0, Math.cos(deg45)]
    );

    const e = new Entity({
      position: [0, 1, 0],
      localCoordinateSystem: coordinateSystemRotatedByDeg45,
    });

    const pointInLocalSystem: Vec3 = [0.7071067812, 1, 0.7071067812];

    const pointInWorldSystem = e.transformVecToWorldSystem(pointInLocalSystem);

    console.log(pointInWorldSystem);

    const assertValue = [1, 0, 0];

    expect(
      Math.abs(pointInWorldSystem[0] - assertValue[0])
    ).toBeLessThanOrEqual(1e-3);
    expect(
      Math.abs(pointInWorldSystem[1] - assertValue[1])
    ).toBeLessThanOrEqual(1e-3);
    expect(
      Math.abs(pointInWorldSystem[2] - assertValue[2])
    ).toBeLessThanOrEqual(1e-3);
  });
});
