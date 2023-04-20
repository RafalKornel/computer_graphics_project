import "./style.css";
import { Game } from "./Game";
import { registerSlider } from "./registerSlider";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div id="slider-wrapper" style="width: 100%"></div>
    <button id="control"></button>

    <canvas></canvas>
`;

const sliderInput = registerSlider(document.querySelector("#slider-wrapper")!);

const game = new Game({
  canvas: document.querySelector<HTMLCanvasElement>("canvas")!,
  controlButton: document.querySelector<HTMLButtonElement>("button#control")!,
  sliderInput,
});

game.start();
