import AICarController from "../AICarController";

interface LaneControlProps {
  carController: AICarController;
}

export default function LaneControl({ carController }: LaneControlProps) {
  const handleInput = (e: any) => {
    const lanes: string = e.target.value;
    carController.updateLaneCount(parseInt(lanes));
    localStorage.setItem("laneCount", lanes);
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Lanes:</p>
      <input
        type="number"
        name=""
        max="4"
        min="2"
        defaultValue={carController.road.laneCount}
        className="w-11 m-2"
        onInput={handleInput}
      />
    </div>
  );
}
