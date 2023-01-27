import { useEffect, useRef } from "react";
import AICarController from "./AICarController";

interface AICarControllerProps {
  carController: AICarController;
}

export default function AICarUI({ carController }: AICarControllerProps) {
  const canvasRef = useRef(null);

  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  let { cars, road, traffic, bestCar } = carController;

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = 200;

    ctx = canvas.getContext("2d");
    animate();
  }, []);

  const drawUIElements = () => {
    road.draw(ctx);
    traffic.forEach((vehicle) => vehicle.draw(ctx));

    ctx.globalAlpha = 0.2;
    cars.forEach((car) => {
      car.draw(ctx);
    });
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, true);
  };

  const animate = () => {
    canvas.height = window.innerHeight;
    bestCar = carController.update();

    ctx.translate(0, -bestCar.y + canvas.height * 0.7);
    drawUIElements();
    requestAnimationFrame(animate);
  };

  return (
    <div className="flex">
      <canvas id="carCanvas" className="bg-slate-400" ref={canvasRef}></canvas>
    </div>
  );
}
