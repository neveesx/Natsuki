import { Schema, model } from "mongoose";

const GuildSchema = new Schema({
    _id: { type: String, required: true },
    prefix: { type: String, max: 2, default: "n!"}
});

export default model('Guilds', GuildSchema);