import { Color, TriangleIndices, Vec3 } from "../types";
import { Entity } from "../Entity";
import { Mesh } from "./Mesh";

type CubeParams = {
  dimension: number;
  position?: Vec3;
  color: Color;
};

export class Cube extends Entity {
  constructor({ dimension, color, position = [0, 0, 0] }: CubeParams) {
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
      [2, 1, 0],

      // Right
      [2, 5, 6],
      [6, 1, 2],

      // // Front
      [7, 6, 5],
      [5, 4, 7],

      // // Left
      [0, 7, 4],
      [3, 0, 4],

      // // Top
      [2, 3, 4],
      [4, 5, 2],

      // // Bottom
      [0, 6, 7],
      [0, 1, 6],
    ];

    const mesh = new Mesh(vertices, meshVertexIndices, color);

    super({ mesh, position });
  }
}
