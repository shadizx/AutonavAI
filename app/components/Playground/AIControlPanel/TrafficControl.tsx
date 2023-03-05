import type AICarController from "../../AICarController";

interface TrafficControlProps {
  carController: AICarController;
}

export default function TrafficControl({ carController }: TrafficControlProps) {
  const handleInput = (e: any) => {
    const rows: number = parseInt(e.target.value);
    if (rows > 15 || rows < 1 || Number.isNaN(rows)) return;
    carController.updateTrafficRows(rows);
    localStorage.setItem("trafficRows", String(rows));
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Traffic Rows:</p>
      <input
        type="number"
        inputMode="numeric"
        name=""
        max="15"
        min="1"
        defaultValue={carController.trafficRows}
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
