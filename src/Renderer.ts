import { WINDOW_WIDTH, WINDOW_HEIGHT } from "./constants";
import { FramerateCounter } from "./FramerateCounter";

let offset = 0;

const recalculate = (buffer: Uint8ClampedArray) => {
  offset += 10;

  for (let i = 0; i < buffer.length; i++) {
    const r = i % 255;
    const g = (i + offset) % 255;
    const b = i % 255;
    const a = i % 255;

    buffer[i * 4 + 0] = r;
    buffer[i * 4 + 1] = g;
    buffer[i * 4 + 2] = b;
    buffer[i * 4 + 3] = a;
  }
};

export class Renderer extends FramerateCounter {
  private width: number;
  private height: number;

  private ctx: CanvasRenderingContext2D;

  private raf: number | undefined;

  private buffer: Uint8ClampedArray;

  constructor(canvas: HTMLCanvasElement, controlButton: HTMLButtonElement) {
    super();

    this.height = 360;
    this.width = 640;

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Your browser doesn't support canvas");
    }

    this.ctx = ctx;

    this.buffer = new Uint8ClampedArray(this.width * this.height * 4);

    this.registerControlButton(controlButton);
  }

  public start() {
    this.loop();
  }

  private loop() {
    this.incrementFrames();

    recalculate(this.buffer);

    this.draw();

    this.raf = requestAnimationFrame(() => this.loop());
  }

  private draw() {
    const imageData = new ImageData(this.buffer, this.width, this.height);

    this.ctx.putImageData(imageData, 0, 0);
  }

  private registerControlButton(button: HTMLButtonElement) {
    button.innerHTML = "pause";

    button.addEventListener("click", () => {
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = undefined;

        button.innerHTML = "start";
      } else {
        this.loop();

        button.innerHTML = "pause";
      }
    });
  }
}
