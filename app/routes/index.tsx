import CarCanvas from "~/components/car/car-canvas";
import NetworkCanvas from "~/components/car/network-canvas";

export default function Index() {
  return (
    <div id="background" className="m-0 bg-slate-800">
      <div id="CarCanvas" className="inline-block">
        <CarCanvas />
      </div>
      <div id="NetworkCanvas" className="inline-block">
        <NetworkCanvas />
      </div>
    </div>
  );
}
