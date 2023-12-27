import { CommandData, CommandInformations, CommandPermissions, CommandRunner } from "../types/Command";

export default class CommandBuilder implements CommandData {
    declare name: string;
    declare runner: CommandRunner;
    declare infos: CommandInformations;

    public permissions?: CommandPermissions;
    public aliases?: string[];

    public constructor(data: CommandData) {
        Object.assign(this, data)
    }
}
