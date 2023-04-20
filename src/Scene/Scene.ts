import { CoordinateSystem } from "./CoordinateSystem";
import { Entity } from "../Entity";

export class Scene {
  public objects: Entity[];
  readonly coordinateSystem: CoordinateSystem;

  constructor() {
    this.objects = [];

    this.coordinateSystem = new CoordinateSystem(
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    );
  }

  public addObject(object: Entity) {
    this.objects.push(object);
  }

  public addObjects(objects: Entity[]) {
    objects.forEach((object) => this.addObject(object));
  }
}
