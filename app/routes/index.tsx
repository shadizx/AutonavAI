import { useEffect, useRef, useState } from "react";
import Car from "../components/car";

export default function Index() {
  const canvasRef = useRef(null);
  
  const loadCar = (ctx: any) => {
    const car = new Car(100, 100, 30, 50);
    car.draw(ctx);
  };

  const animate = () => {
    
  };

  useEffect(() => {
    const canvas = canvasRef.current as any;
    canvas.height = window.innerHeight;
    canvas.width = 200;

    const ctx = canvas.getContext("2d");
    loadCar(ctx);
  });

  return (
    <canvas
      id="myCanvas"
      className="bg-slate-400 mx-auto"
      ref={canvasRef}
    ></canvas>
  );
}
