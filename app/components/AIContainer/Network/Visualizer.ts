import { interpolate } from "~/utils/interpolate";
import { Level, NeuralNetwork } from "./Network";

export default class Visualizer {
  static readonly margin = 50;

  static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
    const left = Visualizer.margin;
    const top = Visualizer.margin;
    const width = ctx.canvas.width - Visualizer.margin * 2;
    const height = ctx.canvas.width - Visualizer.margin * 2;

    Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
  }

  static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number
  ) {
    const { inputs, outputs } = level;
    const right = left + width;
    const bottom = top + height;

    const nodeRadius = 19;

    inputs.forEach((input, i) => {
      const percent = inputs.length === 1 ? 0.5 : i / (inputs.length - 1);
      const x = interpolate(left, right, percent);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
  }
}
