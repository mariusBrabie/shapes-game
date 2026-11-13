import { Application } from "pixi.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";
import { Game } from "./Game.js";

async function start() {
  const app = new Application();
  await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    background: "white",
    antialias: true,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true,
  });
  document.getElementById("app").appendChild(app.canvas);
  app.canvas.style.width = "100%";
  app.canvas.style.height = "auto";

  const game = new Game(app);
  game.start();
}

start();
