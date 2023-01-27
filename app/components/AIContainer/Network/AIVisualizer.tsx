import { useEffect, useRef } from "react";
import { NeuralNetwork } from "./Network";
import Visualizer from "./Visualizer";
import AICarController from "../AICarController";

interface AIVisualizerProps {
  carController: AICarController;
}

export default function AIVisualizer({ carController }: AIVisualizerProps) {
  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 300;

    ctx = canvas.getContext("2d");
    animate();
  }, []);

  const animate = (time: number | any = undefined) => {
    canvas.height = window.innerHeight * (2 / 3);
    ctx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(ctx, carController.bestCar.brain as NeuralNetwork);
    requestAnimationFrame(animate);
  };

  return (
    <canvas
      id="visualizerCanvas"
      className="bg-slate-700 rounded-2xl shadow-2xl"
      ref={canvasRef}
    ></canvas>
  );
}
