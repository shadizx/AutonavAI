import AICarController from "../AICarController";
import CounterControl from "./CounterControl";
import MutationControl from "./MutationControl";
import SpeedControl from "./SpeedControl";
import TrafficControl from "./TrafficControl";

interface AIControlPanelProps {
  carController: AICarController;
}

export default function AIControlPanel({ carController }: AIControlPanelProps) {
  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl">
      <div className="w-full">
        <CounterControl carController={carController} />
      </div>
      <div className="w-full">
        <SpeedControl carController={carController} />
      </div>
      <div className="w-full">
        <MutationControl carController={carController} />
      </div>
      <div className="w-full">
        <TrafficControl carController={carController} />
      </div>
    </div>
  );
}
