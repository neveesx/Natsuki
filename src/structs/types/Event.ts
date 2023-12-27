import { ClientEvents } from "discord.js";

export type EventType<E extends keyof ClientEvents> = {
    type: E;
    once?: boolean;
    runner: (...params: ClientEvents[E]) => any;
};