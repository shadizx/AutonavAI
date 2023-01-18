import { useEffect, useRef } from "react";
import Car from "../Car/Car";
import Road from "../Car/Road";

interface AICarUIProps {
  setCar: any;
}

export default function AICarUI({ setCar }: AICarUIProps) {
  const canvasRef = useRef(null);
  let canvas = canvasRef.current as any;
  let ctx: CanvasRenderingContext2D;

  let car: Car | any = null;
  let road: Road;
  let traffic: Array<Car>;
  const trafficColor = "black";

  useEffect(() => {
    canvas = canvasRef.current as any;
    canvas.width = 200;

    ctx = canvas.getContext("2d");
    road = new Road(canvas.width / 2, canvas.width * 0.9, ctx);
    car = new Car(road.getLaneCenter(1), 100, 30, 50, ctx, "AI");
    traffic = [
      new Car(
        road.getLaneCenter(1),
        -100,
        30,
        50,
        ctx,
        "DUMMY",
        trafficColor,
        2
      ),
    ];
    animate();
  }, []);

  const animate = () => {
    for (let vehicle of traffic) {
      vehicle.update(road.borders, []);
    }
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw();
    for (let vehicle of traffic) {
      vehicle.draw();
    }
    car.draw();
    setCar(car);
    requestAnimationFrame(animate);
  };

  return (
    <canvas
      id="carCanvas"
      className="bg-slate-400"
      ref={canvasRef}
      onLoad={() => setCar(car)}
    ></canvas>
  );
}
