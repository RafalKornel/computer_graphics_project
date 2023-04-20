import { Matrix } from "../Matrix";
import { Vec3 } from "../types";
import { CoordinateSystem } from "../Scene/CoordinateSystem";
import { Mesh } from "../Scene/Mesh";

export type EntityParams = {
  position?: Vec3;
  localCoordinateSystem?: CoordinateSystem;
  mesh?: Mesh;
};

export class Entity {
  private _position: Vec3;
  private _localCoordinateSystem: CoordinateSystem;
  private _mesh?: Mesh;

  private _toLocalTransformMatrix: Matrix;
  private _toWorldTransformMatrix: Matrix;

  constructor({
    mesh,
    localCoordinateSystem = new CoordinateSystem(
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ),
    position = [0, 0, 0],
  }: EntityParams = {}) {
    this._position = position;
    this._localCoordinateSystem = localCoordinateSystem;

    this._mesh = mesh;

    this._toLocalTransformMatrix = this.calculateToLocalTransformMatrix();
    this._toWorldTransformMatrix = this.calculateToWorldTransformMatrix();
  }

  public get position() {
    return this._position;
  }

  public get localCoordinateSystem() {
    return this._localCoordinateSystem;
  }

  public get mesh() {
    return this._mesh;
  }

  public transformVecToLocalSystem([x, y, z]: Vec3): Vec3 {
    const [_x, _y, _z] = this._toLocalTransformMatrix.multiplyVec([x, y, z, 1]);

    return [_x, _y, _z];
  }

  public transformVecToWorldSystem([x, y, z]: Vec3): Vec3 {
    const [_x, _y, _z] = this._toWorldTransformMatrix.multiplyVec([x, y, z, 1]);

    return [_x, _y, _z];
  }

  public move([x, y, z]: Vec3) {
    const [_x, _y, _z] = this._position;

    this._position = [_x + x, _y + y, _z + z];

    this.recalculateToLocalTransformMatrix();
    this.recalculateToWorldTransformMatrix();
  }

  public rotateY(angle: number) {
    const y_matrix = new Matrix([
      [Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)],
    ]);

    this._localCoordinateSystem = CoordinateSystem.fromMatrix(
      y_matrix.multiplyMatrix(this._localCoordinateSystem.matrix)
    );

    this.recalculateToWorldTransformMatrix();
    this.recalculateToLocalTransformMatrix();
  }

  private calculateToLocalTransformMatrix() {
    const x = this.localCoordinateSystem.x;
    const y = this.localCoordinateSystem.y;
    const z = this.localCoordinateSystem.z;
    const m1 = new Matrix([
      [-x[0], -x[1], -x[2], 0],
      [-y[0], -y[1], -y[2], 0],
      [-z[0], -z[1], -z[2], 0],
      [0, 0, 0, 1],
    ]);

    const c_x = this.position[0];
    const c_y = this.position[1];
    const c_z = this.position[2];

    const m2 = new Matrix([
      [1, 0, 0, c_x],
      [0, 1, 0, c_y],
      [0, 0, 1, c_z],
      [0, 0, 0, 1],
    ]);

    const viewTransformMatrix = m1.multiplyMatrix(m2);

    return viewTransformMatrix;
  }

  public recalculateToLocalTransformMatrix() {
    this._toLocalTransformMatrix = this.calculateToLocalTransformMatrix();
  }

  private calculateToWorldTransformMatrix() {
    const _x = this.localCoordinateSystem.x;
    const _y = this.localCoordinateSystem.y;
    const _z = this.localCoordinateSystem.z;

    const m = new Matrix([
      [_x[0], _y[0], _z[0], -this.position[0]],
      [_x[1], _y[1], _z[1], -this.position[1]],
      [_x[2], _y[2], _z[2], -this.position[2]],
      [0, 0, 0, 1],
    ]);

    return m;
  }

  public recalculateToWorldTransformMatrix() {
    this._toWorldTransformMatrix = this.calculateToWorldTransformMatrix();
  }
}
