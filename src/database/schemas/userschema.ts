import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    _id: { type: String, required: true },
    Blacklisted: { type: Object, default: {} }
});

export default model('User', UserSchema);