import {Schema} from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema({
    user_fixed : {type: String, required:true},
    password: {type: String, required:true},
    username: {type: String, required:true},
    email: {type: String, required:true}
});
export default mongoose.model("Usernew", userSchema);