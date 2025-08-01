import mongoose, {Schema} from "mongoose"

const Task_schema = new Schema({
    Task: {type: String, required: true},
    Assigned_to: {type: String, required:true},
    Assigned_by: {type: String, required:true},
    created_at: {type: Date, default: new Date()},
    deadline: {type:Date, required:true}
})

export default mongoose.model("Task", Task_schema);