import { TriangleIndices, Vec3 } from "../types";

export class Mesh {
  private _vertices: Vec3[];
  private _triangleIndices: TriangleIndices[];

  constructor(vertices: Vec3[], indices: TriangleIndices[]) {
    this._vertices = vertices;
    this._triangleIndices = indices;
  }

  public get vertices() {
    return this._vertices;
  }

  public get triangleIndices() {
    return this._triangleIndices;
  }
}