import { RenderEngine } from "./RenderEngine/RenderEngine";
import { CoordinateSystem } from "./Scene/CoordinateSystem";
import { Cube } from "./Scene/Cube";
import { Scene } from "./Scene/Scene";
import { Camera } from "./Camera";

const DEG_45 = Math.PI / 4;

const CARTESIAN = new CoordinateSystem([1, 0, 0], [0, 1, 0], [0, 0, 1]);

const ROTATE_CUBES = true;

type GameParams = {
  canvas: HTMLCanvasElement;
  controlButton?: HTMLButtonElement;
  sliderInput?: HTMLInputElement;
  painterAlgCheckbox?: HTMLInputElement;
};

export class Game extends RenderEngine {
  private _scene: Scene;
  private _camera: Camera;

  constructor({
    canvas,
    controlButton,
    sliderInput,
    painterAlgCheckbox,
  }: GameParams) {
    super(canvas, controlButton, {
      height: 800,
      width: 800,
      logFramerate: false,
    });

    const cubes = [
      new Cube({ dimension: 1, color: [200, 0, 0], position: [2, 0.6, 2] }),
      new Cube({ dimension: 1, color: [0, 200, 0], position: [2, 0.5, 4] }),
      new Cube({ dimension: 2, color: [0, 0, 200], position: [-2, 0, 3] }),
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

    if (painterAlgCheckbox) {
      this.registerPainterAlgCheckbox(painterAlgCheckbox);
    }
  }

  loop() {
    if (ROTATE_CUBES) {
      this._scene.objects.forEach((object, i) => {
        const axis = (["x", "y", "z"] as const)[i & 3];

        object.rotate(axis, DEG_45 / 100);
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

  private registerPainterAlgCheckbox(checkbox: HTMLInputElement) {
    checkbox.addEventListener("change", () => {
      this._camera.togglePainterAlgorithm();
    });
  }
}
