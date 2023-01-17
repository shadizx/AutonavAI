import { useState } from "react";
import Car from "../Car/Car";
import CarCanvas from "../Car/CarCanvas";
import NetworkCanvas from "./Network/NetworkCanvas";

export default function AIContainer() {
  // default car
  const [car, setCar] = useState(new Car(0, 0, 0, 0, null, ""));

  return (
    <div>
      <div id="CarCanvas" className="inline-block">
        <CarCanvas setCar={setCar} />
      </div>
      <div id="NetworkCanvas" className="inline-block">
        <NetworkCanvas car={car} />
      </div>
    </div>
  );
}
