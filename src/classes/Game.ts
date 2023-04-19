import { BaseRenderEngine } from "./BaseRenderer";
import { Camera } from "./Camera";
import { CoordinateSystem } from "./CoordinateSystem";
import { Cube } from "./Cube";
import { Scene } from "./Scene";

const DEG_45 = Math.PI / 4;

const CARTESIAN = new CoordinateSystem([1, 0, 0], [0, 1, 0], [0, 0, 1]);

const rotated = new CoordinateSystem(
  [-Math.sin(DEG_45), 0, Math.cos(DEG_45)],
  [Math.cos(DEG_45), 0, Math.sin(DEG_45)],
  [0, 1, 0]
);

const ROTATE_CUBES = true;

type GameParams = {
  canvas: HTMLCanvasElement;
  controlButton?: HTMLButtonElement;
  sliderInput?: HTMLInputElement;
};

export class Game extends BaseRenderEngine {
  private _scene: Scene;
  private _camera: Camera;

  constructor({ canvas, controlButton, sliderInput }: GameParams) {
    super(canvas, controlButton, {
      height: 600,
      width: 600,
      logFramerate: false,
    });

    const cubes = [
      new Cube({ dimension: 1, color: [255, 0, 0], position: [2, 0.6, 2] }),
      new Cube({ dimension: 1, color: [0, 255, 0], position: [2, 0.5, 4] }),
      new Cube({ dimension: 2, color: [0, 0, 255], position: [-2, 0, 3] }),
    ];

    const scene = new Scene();

    scene.addObjects(cubes);

    this._scene = scene;

    this._camera = new Camera({
      buffer: this.buffer,
      bufferWidth: this._bufferWidth,
      width: this.width,
      height: this.height,
      focalDistance: 1,
      position: [0, 0, -1],
      localCoordinateSystem: CARTESIAN,
    });

    if (sliderInput) {
      this.registerSliderInput(sliderInput);
    }
  }

  loop() {
    if (ROTATE_CUBES) {
      this._scene.objects.forEach((object) => {
        object.rotateY(DEG_45 / 100);
        // object.move([0, -0.01, 0]);
      });
    }

    this._camera.renderScene(this._scene);
  }

  private registerSliderInput(sliderInput: HTMLInputElement) {
    sliderInput.addEventListener("input", (e: any) => {
      const value = Number(e.target.value);

      this._camera.changeFocalDistance(value);
    });
  }
}
