import { useState } from "react";
import type { FormEvent } from "react";

function AddTask({onAddedTask}: {onAddedTask: () => void}) {
  const [taskName, setTaskName] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(import.meta.env.VITE_ADD_TASK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskName, isDone: false }),
      });

      if (!res.ok) {
        throw new Error("Failed to save task");
      }
      onAddedTask();
      setTaskName(""); // Clear input after successful save
    } catch (err) {
      console.error(err);
      alert("Unable to save task");
    }
  };

  return (
    <div className="container text-white bg-red-200/10 rounded-2xl flex justify-center my-3 p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="rounded-3xl p-2 px-6 mb-3 h-16 sm:w-80"
          placeholder="Add your Task..."
          required
        />
        <br />
        <button
          type="submit"
          className="bg-blue-800 rounded p-2 hover:bg-blue-600 flex justify-end px-5"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTask;
