import { useEffect, useRef, useCallback } from "react";
import KeyHandler from "../Car/KeyHandler";
import type Game from "./Game";

interface CarUIProps {
  game: Game;
  isGameActive: boolean;
}

export default function CarUI({ game, isGameActive }: CarUIProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const drawUIElements = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    game.user.road.draw(ctx);
    game.user.finishLine.draw(ctx);
    game.user.traffic.forEach((car) =>
      game.user.carRelativePosition(car) === 0 ? car.draw(ctx) : null
    );
    game.user.car.draw(ctx);
  }, [game]);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.height = window.innerHeight * (2 / 3);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    game.user.update();
    ctx.translate(0, -game.user.car.y + canvasRef.current?.height * 0.7);
    drawUIElements();
    if (isGameActive)
      animationFrameRef.current = requestAnimationFrame(animate);
  }, [game.user, drawUIElements, isGameActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    canvas.width = 200;
    canvas.height = window.innerHeight * (2 / 3);

    const { car } = game.user;

    car.keyHandler = new KeyHandler("KEYS");

    animate();
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, game, isGameActive]);

  return (
    <canvas
      id="carCanvas"
      className="bg-slate-700 rounded-2xl shadow-2xl mx-8"
      ref={canvasRef}
    ></canvas>
  );
}
