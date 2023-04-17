import { TriangleIndices, Vec3 } from "../types";
import { Entity } from "./Entity";
import { Mesh } from "./Mesh";

type CubeParams = {
  dimension: number;
  position?: Vec3;
};

export class Cube extends Entity {
  constructor({ dimension, position = [0, 0, 0] }: CubeParams) {
    const x_min = -dimension / 2;
    const x_plus = +dimension / 2;

    const y_min = -dimension / 2;
    const y_plus = +dimension / 2;

    const z_min = -dimension / 2;
    const z_plus = +dimension / 2;

    const vertices: Vec3[] = [
      [x_min, y_min, z_min],
      [x_min, y_plus, z_min],
      [x_min, y_plus, z_plus],
      [x_min, y_min, z_plus],
      [x_plus, y_min, z_plus],
      [x_plus, y_plus, z_plus],
      [x_plus, y_plus, z_min],
      [x_plus, y_min, z_min],
    ];

    const meshVertexIndices: TriangleIndices[] = [
      // Back
      [0, 3, 2],
      [0, 2, 1],

      // // Right
      [6, 1, 2],
      [2, 5, 6],

      // // Front
      [7, 5, 6],
      [7, 5, 4],

      // // Left
      [7, 4, 3],
      [7, 3, 0],

      // // Top
      [4, 5, 2],
      [4, 2, 3],

      // // Bottom
      [7, 0, 1],
      [7, 1, 6],
    ];

    const mesh = new Mesh(vertices, meshVertexIndices);

    super({ mesh, position });
  }
}
