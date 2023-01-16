import { useEffect, useRef } from "react";
import Visualizer from "../AIContainer/Network/Visualizer";

export default function NetworkCanvas() {
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
    // Visualizer.drawNetwork(ctx, car.brain);
    requestAnimationFrame(animate);
  };

  return (
    <canvas id="networkCanvas" className="bg-black" ref={canvasRef}></canvas>
  );
}
