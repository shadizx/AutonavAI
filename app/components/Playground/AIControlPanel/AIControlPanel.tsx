import CarCounter from "./CarCounter";
import DeleteButton from "./DeleteButton";
import LaneControl from "./LaneControl";
import MutationControl from "./MutationControl";
import SpeedControl from "./SpeedControl";
import TrafficControl from "./TrafficControl";
import type AICarController from "../../AICarController";

interface AIControlPanelProps {
  carController: AICarController;
}

export default function AIControlPanel({ carController }: AIControlPanelProps) {
  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl mx-2">
      <div className="w-full">
        <CarCounter carController={carController} />
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
      <div className="w-full">
        <LaneControl carController={carController} />
      </div>
      <div>
        <DeleteButton carController={carController} />
      </div>
    </div>
  );
}
