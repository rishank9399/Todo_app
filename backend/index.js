// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Task from "./model/taskModel.js";

// dotenv.config();
// const app = express();
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URL)
//     .then(()=>{
//         console.log("Connected to DB");
//     })
//     .catch((err) => {
//         console.log(err);
//     })

// app.get("/", (req, res) => {
//     res.send("Root route");
// })

// app.post("/add", async (req, res) => {
//     try{
//         const { taskName, isDone } = req.body;

//         const task = new Task({
//             taskName,
//             isDone,
//         })

//         await task.save();

//         res.send("Task Saved");
//     } catch(err) {
//         console.log(err);
//         res.send("Failed to save. An Error occured");
//     }
// })

// app.get("/alltask", async (req, res) => {
//     try{
//         let data = await Task.find({});
//         res.json(data);
//     }
//     catch(err) {
//         console.log(err);
//         res.send("Unable to fetch");
//     }
// })

// app.delete("/delete/:id", async (req, res) => {
//     try{
//         const { id } = req.params;
        
//         const user = await Task.findByIdAndDelete(id)
//         if(!user){
//             return res.send("User doesn't exist");
//         }
//         console.log(user)
//         res.json({ message: "Task Deleted", success: true });
//     }
//     catch(err) {
//         console.log(err)
//     }
// })

// app.post("/update/:id", async (req, res) => {
//     try{
//         const { id } = req.params;
//         const { taskName, isDone } = req.body;
        
//         await Task.findByIdAndUpdate(
//             id,
//             {taskName, isDone}
//         )
//         res.json({ message: "Task Updated", success: true });
//     }
//     catch(err) {
//         console.log(err)
//     }
// })

// app.listen(8080, () => {
//     console.log("Connected on port 8080")
// })

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Task from "./model/taskModel.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // ✅ Allow frontend requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("MongoDB error:", err));

// Root
app.get("/", (req, res) => {
  res.send("Root route");
});

// Create Task 
app.post("/add", async (req, res) => {
  try {
    const { taskName, isDone } = req.body;

    const task = new Task({ taskName, isDone });
    await task.save();

    res.status(201).send("Task Saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save. An Error occurred");
  }
});

// Get all tasks
app.get("/alltask", async (req, res) => {
  try {
    const data = await Task.find({});
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to fetch");
  }
});

// Delete task
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
 
    if (!task) {
      return res.status(404).send("Task doesn't exist");
    }

    res.json({ message: "Task Deleted", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

// Update task
app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, isDone } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskName, isDone },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task Updated", success: true, task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating task");
  }
});

// Start server
app.listen(8080, () => {
  console.log("Connected on port 8080");
});
