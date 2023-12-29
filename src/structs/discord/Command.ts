import { CommandData, CommandInformations, CommandPermissions, CommandRunner, CommandSubData } from "../types/Command";

export default class CommandBuilder implements CommandData {
    declare name: string;
    declare runner: CommandRunner;
    declare infos: CommandInformations;

    public permissions?: CommandPermissions;
    public data?: CommandSubData;
    public aliases?: string[];
    public devops?: boolean;

    public constructor(data: CommandData) {
        Object.assign(this, data)
    }
}
