import mongoose from "mongoose";
import taskSchema from "../schema/taskSchema.js";

const Task = mongoose.model("task", taskSchema);

export default Task;