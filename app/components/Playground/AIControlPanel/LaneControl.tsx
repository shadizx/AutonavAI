import type AICarController from "../../AICarController";

interface LaneControlProps {
  carController: AICarController;
}

export default function LaneControl({ carController }: LaneControlProps) {
  const handleInput = (e: any) => {
    let lanes: number = parseInt(e.target.value);
    if (lanes > 4 || lanes < 2 || Number.isNaN(lanes)) return;
    carController.updateLaneCount(lanes);
    localStorage.setItem("laneCount", String(lanes));
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Lanes:</p>
      <input
        type="number"
        inputMode="numeric"
        name=""
        max="4"
        min="2"
        defaultValue={carController.laneCount}
        className="w-14 m-2 bg-slate-700 px-2 py-1
        text-base
        font-normal
        text-slate-50
        bg-clip-padding
        border border-solid border-slate-500
        rounded
        transition
        ease-in-out
        focus:text-slate-50 focus:bg-gray-700 focus:border-blue-600 focus:outline-none"
        onInput={handleInput}
      />
    </div>
  );
}
