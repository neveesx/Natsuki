import { Message, PermissionResolvable } from "discord.js";
import Natsuki from "../discord/NatsukiClient";

export type CommandRunner = (client: Natsuki, message: Message, params: string[]) => any | Promise<any>;

export interface CommandPermissions {
    author?: PermissionResolvable[]
    client?: PermissionResolvable[]
}

export interface CommandInformations {
    description: string;
    category: string;
    usage: string;
}

export interface CommandSubData {
    devops?: boolean;
    requiredDB?: boolean;
}

export interface CommandData {
    name: string;
    aliases?: string[];
    permissions?: CommandPermissions;
    data?: CommandSubData
    infos: CommandInformations;
    runner: CommandRunner
}