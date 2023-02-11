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
      <button
        id="deleteButton"
        className="bg-red-500 hover:bg-red-700 py-2 px-4 m-2 my-4 rounded"
        onClick={() => {
          if (window !== undefined) {
            localStorage.removeItem(
              "bestBrain" + carController.laneCount.toString()
            );
            localStorage.removeItem(
              "bestBrainDistance" + carController.laneCount.toString()
            );
          }
        }}
      >
        <p className="text-slate-50">Delete Brain</p>
      </button>
    </div>
  );
}
