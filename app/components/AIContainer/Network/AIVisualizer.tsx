import { useEffect, useRef, useCallback } from "react";
import { NeuralNetwork } from "./Network";
import AICarController from "../AICarController";
import Visualizer from "./Visualizer";

interface AIVisualizerProps {
  carController: AICarController;
}

export default function AIVisualizer({ carController }: AIVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.height = window.innerHeight * (2 / 3);
      ctx.lineDashOffset = -time / 50;
      Visualizer.drawNetwork(ctx, carController.bestCar.brain as NeuralNetwork);

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [carController]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 300;

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      id="visualizerCanvas"
      className="bg-slate-700 rounded-2xl shadow-2xl"
      ref={canvasRef}
    ></canvas>
  );
}
