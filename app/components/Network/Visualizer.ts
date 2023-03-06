import { interpolate } from "../utils/interpolate";
import type { Level, NeuralNetwork } from "./Network";

export default class Visualizer {
  static readonly margin = 50;
  static readonly gray = "#334155";
  static readonly leftArrow = "\u2b05";
  static readonly rightArrow = "\u2b95";

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
        i === levels.length - 1
          ? [Visualizer.leftArrow, Visualizer.rightArrow]
          : [];

      Visualizer.drawLevel(
        ctx,
        levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        outputLabels,
        i
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
    outputLabels: string[],
    levelNumber: number
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

    if (levelNumber === 0) {
      this.drawFirstLevel(
        inputs,
        outputs,
        biases,
        top,
        left,
        bottom,
        right,
        nodeRadius,
        ctx
      );
    } else {
      this.drawSecondlevel(
        outputs,
        biases,
        outputLabels,
        top,
        left,
        right,
        nodeRadius,
        ctx
      );
    }
  }

  private static drawFirstLevel(
    inputs: Array<any>,
    outputs: Array<any>,
    biases: Array<any>,
    top: number,
    left: number,
    bottom: number,
    right: number,
    nodeRadius: number,
    ctx: CanvasRenderingContext2D
  ) {
    inputs.forEach((input, i) => {
      const x = Visualizer.getNodeXPosition(inputs, i, left, right);
      Visualizer.drawNode(ctx, x, bottom, nodeRadius, Visualizer.gray);
      ctx.strokeStyle = Visualizer.getRGBA(0.5);
      ctx.stroke();
      Visualizer.drawNode(
        ctx,
        x,
        bottom,
        nodeRadius * 0.8,
        Visualizer.getRGBA(inputs[i])
      );
    });

    outputs.forEach((output, i) => {
      const x = Visualizer.getNodeXPosition(outputs, i, left, right);
      this.drawNode(ctx, x, top, nodeRadius, Visualizer.gray);
      this.drawNode(
        ctx,
        x,
        top,
        nodeRadius * 0.6,
        Visualizer.getRGBA(outputs[i])
      );
      this.drawDashedNode(ctx, x, top, nodeRadius * 0.8, biases[i]);
    });
  }

  private static drawSecondlevel(
    outputs: Array<any>,
    biases: Array<any>,
    outputLabels: Array<any>,
    top: number,
    left: number,
    right: number,
    nodeRadius: number,
    ctx: CanvasRenderingContext2D
  ) {
    const finalDirection =
      outputs[0] > outputs[1] ? 0 : outputs[0] < outputs[1] ? 1 : -1;

    outputs.forEach((output, i) => {
      const x = Visualizer.getNodeXPosition(outputs, i, left, right);

      Visualizer.drawNode(ctx, x, top, nodeRadius, Visualizer.gray);
      this.drawDashedNode(ctx, x, top, nodeRadius, biases[i]);
      Visualizer.drawLabel(
        x,
        top,
        nodeRadius,
        outputLabels[i],
        i === finalDirection,
        ctx,
        outputs[i]
      );
    });
  }

  private static drawNode(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    fillStyle: string
  ) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  private static drawLabel(
    x: number,
    y: number,
    radius: number,
    label: string,
    isFinalDirection: boolean,
    ctx: CanvasRenderingContext2D,
    output: number
  ) {
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = Visualizer.getRGBA(output);
    ctx.strokeStyle = Visualizer.getRGBA(0.5);
    ctx.font = radius * 1.1 + "px Arial";
    if (isFinalDirection) {
      ctx.fillText(label, x, y + radius * 0.1);
    }
    ctx.lineWidth = 0.8;
    ctx.strokeText(label, x, y + radius * 0.1);
  }

  private static drawDashedNode(
    ctx: CanvasRenderingContext2D,
    x: number,
    top: number,
    radius: number,
    bias: number
  ) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(x, top, radius, 0, Math.PI * 2);
    ctx.strokeStyle = Visualizer.getRGBA(bias);
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
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
