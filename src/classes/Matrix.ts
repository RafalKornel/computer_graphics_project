import { Vec, Vec2, Vec3 } from "../types";

export class Matrix {
  private _matrix: number[][];
  private _rank: number;

  constructor(m: number[][]) {
    this._matrix = m;

    this._rank = m.length; // assuming square matrices
  }

  public get matrix() {
    return this._matrix;
  }

  public get rank() {
    return this._rank;
  }

  public multiplyVec(v: Vec): Vec {
    if (this._rank !== v.length) {
      throw new Error("Matrix and vector does not align");
    }

    let res: Vec = [];

    for (let row of this._matrix) {
      let sum = 0;
      for (let x = 0; x < v.length; x++) {
        const m_el = row[x];
        const v_el = v[x];

        sum += m_el * v_el;
      }

      res.push(sum);
    }

    return res;
  }

  transpose() {
    const rows = this._rank;
    const cols = this._rank;
    const transposed: number[][] = [];

    // Initialize the transposed matrix with zeros
    for (let i = 0; i < cols; i++) {
      transposed[i] = [];
      for (let j = 0; j < rows; j++) {
        transposed[i][j] = 0;
      }
    }

    // Populate the transposed matrix with the values from the original matrix
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        transposed[j][i] = this._matrix[i][j];
      }
    }

    this._matrix = transposed;
  }

  public multiplyMatrix(m: Matrix) {
    if (m.rank !== this._rank) {
      throw new Error("Matrices does not align");
    }

    let columns = [];

    for (let x = 0; x < m.rank; x++) {
      let column = [];

      for (let y = 0; y < m.rank; y++) {
        let sum = 0;

        for (let i = 0; i < m.rank; i++) {
          sum += this._matrix[y][i] * m.matrix[i][x];
        }

        column.push(sum);
      }

      columns.push(column);
    }

    const new_m = new Matrix(columns);

    new_m.transpose();

    return new_m;
  }

  public static cross(v1: Vec3, v2: Vec3): Vec3 {
    const x = v1[1] * v2[2] - v1[2] * v2[1];
    const y = v1[2] * v2[0] - v1[0] * v2[2];
    const z = v1[0] * v2[1] - v1[1] * v2[0];

    return [x, y, z] as Vec3;
  }

  public static dot(v1: Vec3, v2: Vec3): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }
}
