import { useState, useEffect, useRef } from "react";
import AICarController from "../AICarController";

interface CounterProps {
  carController: AICarController;
}

const Counter = ({ carController }: CounterProps) => {
  const [carsCollided, setCarsCollided] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setCarsCollided(carController.carsCollided);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(requestRef.current as number);
  }, [carController.carsCollided]);

  return (
    <div className="flex justify-between align-center m-6">
      <p className="text-slate-50 self-center">Cars remaining:</p>
      <div className="flex w-14 justify-items-center align-items-center">
        <p className="text-slate-50 text-xl mx-auto ">
          {carController.numberOfCars - carsCollided}
        </p>
      </div>
    </div>
  );
};

export default Counter;
