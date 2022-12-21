import { useEffect, useRef } from "react";
import Car from "./car";

export default function CarCanvas() {
  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let car: Car;

  const loadCar = (ctx: any) => {
    car = new Car(100, 100, 30, 50, ctx);
    car.draw();
  };

  const animate = () => {
    car.update();
    canvas.height = window.innerHeight;
    car.draw();
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 200;

    const ctx = canvas.getContext("2d");
    loadCar(ctx);
    animate();
  });

  return (
    <canvas
      id="myCanvas"
      className="bg-slate-400 mx-auto"
      ref={canvasRef}
    ></canvas>
  );
}
