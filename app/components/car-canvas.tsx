import { useEffect, useRef } from "react";
import Car from "./car";
import Road from "./road";

export default function CarCanvas() {
  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  let car: Car;
  let road: Road;
  let traffic: Array<Car>;

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 200;

    ctx = canvas.getContext("2d");
    road = new Road(canvas.width / 2, canvas.width * 0.9, ctx);
    car = new Car(road.getLaneCenter(1), 100, 30, 50, ctx, true);
    traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, ctx, false, 2)];
    animate();
  });

  const animate = () => {
    for (let vehicle of traffic) {
      vehicle.update(road.borders);
    }
    car.update(road.borders);
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.65);
    road.draw();
    for (let vehicle of traffic) {
      vehicle.draw();
    }
    car.draw();

    requestAnimationFrame(animate);
  };

  return (
    <canvas
      id="myCanvas"
      className="bg-slate-400 mx-auto"
      ref={canvasRef}
    ></canvas>
  );
}
