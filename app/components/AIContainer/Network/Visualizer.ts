import { interpolate } from "~/utils/Utility";
import { Level, NeuralNetwork } from "./Network";

export default class Visualizer {
  static readonly margin = 50;
  readonly connectionColor = "orange";

  static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
    const left = Visualizer.margin;
    const top = Visualizer.margin;
    const width = ctx.canvas.width - Visualizer.margin * 2;
    const height = ctx.canvas.height - Visualizer.margin * 2;

    const { levels } = network;
    const levelHeight = height / levels.length;

    for (let i = levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        interpolate(
          height - levelHeight,
          0,
          levels.length === 1 ? 0.5 : i / (levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      const outputLabels =
        i === levels.length - 1 ? ["\u2b06", "\u2b05", "\u2b95", "\u2b07"] : [];

      Visualizer.drawLevel(
        ctx,
        levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        outputLabels
      );
    }
  }

  private static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number,
    outputLabels: string[]
  ) {
    const { inputs, outputs, weights, biases } = level;
    const right = left + width;
    const bottom = top + height;
    const nodeRadius = 19;

    // draw connections
    inputs.forEach((input, i) => {
      outputs.forEach((output, j) => {
        ctx.beginPath();
        ctx.moveTo(Visualizer.getNodeXPosition(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.getNodeXPosition(outputs, j, left, right), top);
        ctx.lineWidth = 2;

        ctx.strokeStyle = Visualizer.getRGBA(weights[i][j]);
        ctx.stroke();
      });
    });

    inputs.forEach((input, i) => {
      const x = Visualizer.getNodeXPosition(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = Visualizer.getRGBA(inputs[i]);
      ctx.fill();
    });

    outputs.forEach((output, i) => {
      const x = Visualizer.getNodeXPosition(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = Visualizer.getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = Visualizer.getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.1 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.8;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    });
  }

  // yellow is set for positive values, blue for negative
  static getRGBA(value: number): string {
    const alpha = Math.abs(value);
    const red = value < 0 ? 0 : 255;
    const green = red;
    const blue = value > 0 ? 0 : 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  private static getNodeXPosition(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ) {
    const percent = nodes.length === 1 ? 0.5 : index / (nodes.length - 1);
    return interpolate(left, right, percent);
  }
}
