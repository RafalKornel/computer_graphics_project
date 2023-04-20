import "./style.css";
import { Game } from "./Game";
import { registerSlider } from "./registerSlider";

const legendTemplate = `
<h2>Controls:</h2>

<div class="legend">
  <div>
    <h3>Translation</h3>
    <ul>
      <li>Forward: <strong>w</strong></li>
      <li>Backward: <strong>s</strong></li>
      <li>Left: <strong>a</strong></li>
      <li>Right: <strong>d</strong></li>
    </ul>
  </div>

  <div>
    <h3>Vertical rotation</h3>
    <ul>
      <li>Up: <strong>↑</strong></li>
      <li>Down: <strong>↓</strong></li>
    </ul>
  </div>

  <div>
    <h3>Horizontal rotation</h3>
    <ul>
      <li>Left: <strong>←</strong></li>
      <li>Right: <strong>→</strong></li>
    </ul>
  </div>

  <div>
    <h3>Screw rotation</h3>
    <ul>
      <li>Clockwise: <strong>e</strong></li>
      <li>Counter clockwise: <strong>q</strong></li>
    </ul>
  </div>
</div>
`;

const controlsTemplate = `
<div class="controls">
  ${legendTemplate}

  <div id="slider-wrapper" style="width: 100%"></div>

  <button id="control"></button>

  <label for="painter-alg-checkbox">
    <input id="painter-alg-checkbox" type="checkbox" checked="true"></input>
    Painter algorithm
  </label>

</div>`;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    ${controlsTemplate}
    <div>


      <canvas></canvas>

    </div>
`;

const sliderInput = registerSlider(document.querySelector("#slider-wrapper")!);

const game = new Game({
  canvas: document.querySelector<HTMLCanvasElement>("canvas")!,
  controlButton: document.querySelector<HTMLButtonElement>("button#control")!,
  painterAlgCheckbox: document.querySelector<HTMLInputElement>(
    "input#painter-alg-checkbox"
  )!,
  sliderInput,
});

game.start();
