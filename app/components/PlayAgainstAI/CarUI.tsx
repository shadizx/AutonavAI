import { useEffect, useRef, useCallback } from "react";
import CarController from "../PlayAgainstAI/CarController";

interface CarUIProps {
  carController: CarController;
  isGameStarted: boolean;
}

export default function CarUI({ carController, isGameStarted }: CarUIProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) return;

    canvas.width = 200;
    canvas.height = window.innerHeight * (2 / 3);

    animate();

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameStarted]);

  const drawUIElements = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    carController.road.draw(ctx);
    carController.finishLine.draw(ctx);
    carController.traffic.forEach(
      (car) => carController.carRelativePosition(car) === 0 && car.draw(ctx)
    );
    carController.car.draw(ctx);
  }, [carController]);

  const animate = useCallback(() => {
    carController.update();
    if (!canvasRef.current) return;
    canvasRef.current.height = window.innerHeight * (2 / 3);
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    ctx.translate(0, -carController.car.y + canvasRef.current?.height * 0.7);
    drawUIElements();
    if (isGameStarted) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isGameStarted, carController, drawUIElements, carController.car]);

  return (
    <canvas
      id="carCanvas"
      className="bg-slate-700 rounded-2xl shadow-2xl mx-8"
      ref={canvasRef}
    ></canvas>
  );
}