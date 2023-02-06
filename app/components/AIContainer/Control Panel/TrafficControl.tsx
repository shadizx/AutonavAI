import AICarController from "../AICarController";

interface TrafficControlProps {
  carController: AICarController;
}

export default function TrafficControl({ carController }: TrafficControlProps) {
  const handleInput = (e: any) => {
    const rows = e.target.value;
    carController.updateTrafficRows(rows);
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Traffic Rows:</p>
      <input
        type="number"
        name=""
        max="100"
        min="1"
        defaultValue={carController.trafficRows}
        className="w-11 m-2"
        onInput={handleInput}
      />
    </div>
  );
}
