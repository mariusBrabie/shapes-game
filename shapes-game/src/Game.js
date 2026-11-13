import { Container, Graphics, Rectangle } from "pixi.js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  SPAWN_INTERVAL_MS,
  GRAVITY,
} from "./config.js";
import { InfoPanel } from "./InfoPanel.js";
import { ShapeStorage } from "./ShapeStorage.js";
import { getRandomSize } from "./utils.js";

export class Game {
  constructor(app) {
    this.app = app;
    this.infoPanel = new InfoPanel();
    this.shapes = [];
    this.shapeStorage = new ShapeStorage((shape) => this.removeShape(shape));
    this.spawnTimer = 0;
    this.createScene();
  }

  createScene() {
    this.gameArea = new Container();
    this.app.stage.addChild(this.gameArea);

    const background = new Graphics();
    background.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill("white");
    this.gameArea.addChild(background);

    this.shapesLayer = new Container();
    this.gameArea.addChild(this.shapesLayer);

    const mask = new Graphics();
    mask.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill("red");
    this.gameArea.addChild(mask);
    this.shapesLayer.mask = mask;
  }

  start() {
    this.gameArea.eventMode = "static";
    this.gameArea.hitArea = new Rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.gameArea.on("pointerdown", (e) => this.onGameAreaClick(e));
    this.app.ticker.add((ticker) => this.update(ticker));
  }

  update(ticker) {
    this.spawnFromTop(ticker.deltaMS);
    this.updateShapes(ticker.deltaTime);
  }

  createShape(x, y, size) {
    const shape = this.shapeStorage.takeShape();
    shape.init(x, y, size);
    this.shapesLayer.addChild(shape.view);
    this.shapes.push(shape);
  }

  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index === -1) return;
    this.shapes.splice(index, 1);
    this.shapesLayer.removeChild(shape.view);
    this.shapeStorage.putBackShape(shape);
  }

  onGameAreaClick(e) {
    const position = e.getLocalPosition(this.gameArea);
    const size = getRandomSize();
    this.createShape(position.x - size / 2, position.y - size / 2, size);
  }

  spawnFromTop(deltaMS) {
    this.spawnTimer = this.spawnTimer + deltaMS;
    if (this.spawnTimer < SPAWN_INTERVAL_MS) return;

    this.spawnTimer = 0;
    const size = getRandomSize();
    this.createShape(Math.random() * (GAME_WIDTH - size), -size, size);
  }

  updateShapes(deltaTime) {
    let visibleCount = 0;
    let visibleArea = 0;

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      shape.fall(GRAVITY, deltaTime);

      if (shape.isOutside()) {
        this.removeShape(shape);
        continue;
      }

      if (shape.isVisible()) {
        visibleCount = visibleCount + 1;
        visibleArea = visibleArea + shape.visibleArea();
      }
    }

    this.infoPanel.setVisibleShapesCount(visibleCount);
    this.infoPanel.setVisibleShapesArea(visibleArea);
  }
}
