import "./style.css";
import typescriptLogo from "/typescript.svg";
import viteLogo from "/vite.svg";
import { Game } from "./classes/Game";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>

    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>

    <button id="control"></button>

    <canvas></canvas>
  </div>
`;

const game = new Game(
  document.querySelector<HTMLCanvasElement>("canvas")!,
  document.querySelector<HTMLButtonElement>("button#control")!
);

game.start();
