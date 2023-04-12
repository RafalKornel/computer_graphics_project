import { Vec3 } from "../types";
import { Matrix } from "./Matrix";
import { normalise } from "./normalise";

export class CoordinateSystem {
  private _x: Vec3;
  private _y: Vec3;
  private _z: Vec3;

  readonly matrix: Matrix;

  constructor(x: Vec3, y: Vec3, z: Vec3) {
    this._x = normalise(x);
    this._y = normalise(y);
    this._z = normalise(z);

    this.matrix = new Matrix([this._x, this._y, this._z]);
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get z() {
    return this._z;
  }

  static fromMatrix(m: Matrix) {
    return new CoordinateSystem(
      m.matrix[0] as Vec3,
      m.matrix[1] as Vec3,
      m.matrix[2] as Vec3
    );
  }
}
