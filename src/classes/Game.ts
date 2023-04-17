import { BaseRenderEngine } from "./BaseRenderer";
import { Camera } from "./Camera";
import { CoordinateSystem } from "./CoordinateSystem";
import { Cube } from "./Cube";
import { Scene } from "./Scene";

const DEG_45 = Math.PI / 4;

const COORDINATE_SYSTEMS = {
  cartesian: new CoordinateSystem([1, 0, 0], [0, 1, 0], [0, 0, 1]),
  rotated: new CoordinateSystem(
    [Math.cos(DEG_45), 0, Math.sin(DEG_45)],
    [0, 1, 0],
    [-Math.sin(DEG_45), 0, Math.cos(DEG_45)]
  ),
};

const ROTATE_CUBES = false;

export class Game extends BaseRenderEngine {
  private _scene: Scene;
  private _camera: Camera;

  constructor(canvas: HTMLCanvasElement, controlButton?: HTMLButtonElement) {
    super(canvas, controlButton, {
      height: 640,
      width: 640,
      logFramerate: false,
    });

    const cubes = [
      new Cube({ dimension: 1, position: [1, 0, 2] }),
      new Cube({ dimension: 2, position: [-2, 0, 3] }),
    ];

    const scene = new Scene();

    scene.addObjects(cubes);

    this._scene = scene;

    this._camera = new Camera({
      buffer: this.buffer,
      width: this.width,
      height: this.height,
      focalDistance: 1,
      position: [0, 0, 0],
      localCoordinateSystem: COORDINATE_SYSTEMS.cartesian,
    });
  }

  loop() {
    if (ROTATE_CUBES) {
      this._scene.objects.forEach((object) => {
        object.rotateY(DEG_45 / 100);
      });
    }

    this._camera.renderScene(this._scene);
  }
}
