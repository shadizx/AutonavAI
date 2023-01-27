import { useEffect, useRef, useCallback, useMemo } from "react";
import AICarController from "./AICarController";

interface AICarControllerProps {
  carController: AICarController;
}

export default function AICarUI({ carController }: AICarControllerProps) {
  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = 200;
    canvas.height = 700;

    ctx = canvas.getContext("2d");
    animate();
  }, []);

  const drawUIElements = useMemo(
    () => () => {
      carController.road.draw(ctx);
      carController.traffic.forEach((vehicle) => vehicle.draw(ctx));

      ctx.globalAlpha = 0.2;
      carController.cars.forEach((car) => {
        car.draw(ctx);
      });
      ctx.globalAlpha = 1;
      carController.bestCar.draw(ctx, true);
    },
    [carController]
  );

  const animate = useCallback(() => {
    carController.update();
    canvas.height = window.innerHeight * (2 / 3);

    ctx.translate(0, -carController.bestCar.y + canvas.height * 0.7);
    drawUIElements();
    requestAnimationFrame(animate);
  }, [carController, canvas, drawUIElements]);

  return (
    <div className="flex">
      <canvas id="carCanvas" className="bg-slate-400" ref={canvasRef}></canvas>
    </div>
  );
}
