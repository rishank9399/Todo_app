import { useEffect, useState } from "react";

function AllTasks({ refresh }: { refresh: boolean }) {
  const [allTask, setAllTask] = useState<
    { _id?: string; taskName: string; isDone: boolean; isEditing?: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_ALL_TASK_URL);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAllTask(data.map((t: any) => ({ ...t, isEditing: false })));
      } catch (err) {
        console.log(err);
        setError("Unable to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_DELETE_TASK_URL}${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setAllTask((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
      setError("Unable to delete tasks");
    }
  };

  const markAsDone = async (id: string, isDone: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_UPDATE_TASK_URL}${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: !isDone }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setAllTask((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, isDone: !isDone } : task
        )
      );
    } catch (err) {
      console.log(err);
      setError("Unable to update task");
    }
  };

  const handleEditClick = (id: string) => {
    setAllTask((prev) =>
      prev.map((task) =>
        task._id === id ? { ...task, isEditing: true } : task
      )
    );
  };

  const handleInputChange = (id: string, value: string) => {
    setAllTask((prev) =>
      prev.map((task) =>
        task._id === id ? { ...task, taskName: value } : task
      )
    );
  };

  const handleUpdate = async (id: string) => {
    const taskToUpdate = allTask.find((task) => task._id === id);
    if (!taskToUpdate) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_UPDATE_TASK_URL}${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: taskToUpdate.taskName }),
      });
      if (!res.ok) throw new Error("Unable to update");

      setAllTask((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, isEditing: false } : task
        )
      );
    } catch (err) {
      console.log(err);
      setError("Unable to update task");
    }
  };

  if (loading) return <p className="text-white">Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container text-white bg-green-200/10 text-center rounded-2xl p-5">
      <p className="text-3xl font-bold mb-4 border-b p-3">All Tasks</p>
      {allTask.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul className="px-5">
          {allTask.map((task) => (
            <li
              key={task._id}
              className="mb-2 flex justify-between items-center"
            >
              <input
                type="checkbox"
                onChange={() => markAsDone(task._id!, task.isDone)}
                checked={task.isDone}
              />

              {task.isEditing ? (
                <input
                  className="border rounded-md px-2"
                  value={task.taskName}
                  onChange={(e) => handleInputChange(task._id!, e.target.value)}
                />
              ) : (
                <span
                  className={
                    task.isDone
                      ? "line-through opacity-30 transition duration-500"
                      : "transition duration-500"
                  }
                >
                  {task.taskName}
                </span>
              )}

              <div className="space-x-2">
                {task.isEditing ? (
                  <button
                    className="text-green-400 hover:text-green-600"
                    title="Save task"
                    onClick={() => handleUpdate(task._id!)}
                  >
                    <i className="fa-solid fa-square-check"></i>
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit task"
                    onClick={() => handleEditClick(task._id!)}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(task._id!)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete task"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllTasks;
