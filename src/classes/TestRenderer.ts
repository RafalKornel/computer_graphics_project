import { BaseRenderEngine } from "./BaseRenderer";

export class TestGame extends BaseRenderEngine {
  private offset: number;

  constructor(canvas: HTMLCanvasElement, controlButton?: HTMLButtonElement) {
    super(canvas, controlButton);

    this.offset = 0;
  }

  loop() {
    this.offset += 10;

    for (let i = 0; i < this.buffer.length; i++) {
      const r = i % 255;
      const g = (i + this.offset) % 255;
      const b = i % 255;
      const a = i % 255;

      this.buffer[i * 4 + 0] = r;
      this.buffer[i * 4 + 1] = g;
      this.buffer[i * 4 + 2] = b;
      this.buffer[i * 4 + 3] = a;
    }
  }
}
