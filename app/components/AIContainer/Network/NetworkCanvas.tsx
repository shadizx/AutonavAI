import { useEffect, useRef } from "react";
import { NeuralNetwork } from "./Network";
import Visualizer from "./Visualizer";
import Car from "../../Car/Car";

interface NetworkCanvasProps {
  car: Car;
}

export default function NetworkCanvas({ car }: NetworkCanvasProps) {
  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 300;

    ctx = canvas.getContext("2d");
    animate();
  });

  const animate = () => {
    canvas.height = window.innerHeight;
    Visualizer.drawNetwork(ctx, car.brain as NeuralNetwork);
    requestAnimationFrame(animate);
  };

  return (
    <canvas id="networkCanvas" className="bg-black" ref={canvasRef}></canvas>
  );
}
