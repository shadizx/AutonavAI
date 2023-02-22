import { useEffect, useRef, useCallback, useMemo } from "react";
import AICarController from "./AICarController";

interface AICarControllerProps {
  carController: AICarController;
}

export default function AICarUI({ carController }: AICarControllerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) return;

    canvas.width = 200;
    canvas.height = 700;

    animate();

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawUIElements = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    carController.road.draw(ctx);
    carController.finishLine.draw(ctx);
    carController.traffic.forEach(
      (car) => carController.carRelativePosition(car) === 0 && car.draw(ctx)
    );

    ctx.globalAlpha = 0.2;
    carController.cars.forEach((car) => {
      car.draw(ctx);
    });
    ctx.globalAlpha = 1;
    carController.bestCar.draw(ctx, true);
  }, [carController]);

  const animate = useCallback(() => {
    carController.update();
    if (!canvasRef.current) return;
    canvasRef.current.height = window.innerHeight * (2 / 3);
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    ctx.translate(0, -carController.bestCar.y + canvasRef.current?.height * 0.7);
    drawUIElements();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [carController, drawUIElements, carController.bestCar]);

  return (
    <canvas
      id="carCanvas"
      className="bg-slate-700 rounded-2xl shadow-2xl"
      ref={canvasRef}
    ></canvas>
  );
}
