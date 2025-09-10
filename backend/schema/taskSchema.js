import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

export default taskSchema;