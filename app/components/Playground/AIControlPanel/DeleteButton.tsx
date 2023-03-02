import type AICarController from "../../AICarController";

interface DeleteButtonProps {
  carController: AICarController;
}

export default function DeleteButton({ carController }: DeleteButtonProps) {
  return (
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
  );
}
