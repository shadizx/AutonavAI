import { useEffect, useRef } from "react";

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
    requestAnimationFrame(animate);
  };

  return (
    <canvas
      id="networkCanvas"
      className="bg-black"
      ref={canvasRef}
    ></canvas>
  );
}