import { Color, TriangleIndices, Vec3 } from "../types";

export class Mesh {
  private _vertices: Vec3[];
  private _triangleIndices: TriangleIndices[];
  readonly color: Color;

  constructor(vertices: Vec3[], indices: TriangleIndices[], color: Color) {
    this._vertices = vertices;
    this._triangleIndices = indices;
    this.color = color;
  }

  public get vertices() {
    return this._vertices;
  }

  public get triangleIndices() {
    return this._triangleIndices;
  }
}
