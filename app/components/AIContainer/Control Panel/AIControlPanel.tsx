import AICarController from "../AICarController";
import CounterControl from "./CounterControl";
import LaneControl from "./LaneControl";
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
      <div className="w-full">
        <LaneControl carController={carController} />
      </div>
      <div className="self-center">
        <button
          id="deleteButton"
          className="bg-red-500 hover:bg-red-700 py-1 px-2 m-2 my-4 rounded"
          onClick={() => {
            if (window !== undefined) {
              localStorage.removeItem("bestBrain");
              localStorage.removeItem("bestBrainDistance");
            }
          }}
        >
          Delete Brain
        </button>
      </div>
    </div>
  );
}
