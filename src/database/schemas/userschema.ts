import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    _id: { type: String, required: true },
});

export default model('User', UserSchema);