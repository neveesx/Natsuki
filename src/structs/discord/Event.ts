import { ClientEvents } from "discord.js";
import { EventType } from "../types/Event";

export class EventBuilder<E extends keyof ClientEvents> {
    constructor(options: EventType<E>) {
        Object.assign(this, options);
    }
}