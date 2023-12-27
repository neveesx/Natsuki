import { Utils } from "../../structs/others/Utils";
import { natsuki } from "../..";
import { EventBuilder } from "../../structs/discord/Event";
import MESSAGE from '../../constants/messages.json'
import { guildDB, userDB } from "../../database";
import { IntentsBitField } from "discord.js";

export default new EventBuilder({
  type: "messageCreate",
  runner: async (message) => {
    if (!message.guild || message.author.bot) return;

    let GuildPrefix = await guildDB.findOne({ _id: message.author.id });

    if (!GuildPrefix) GuildPrefix = await guildDB.create({ _id: message.author.id, prefix: natsuki.data.prefix });
    natsuki.data.prefix = GuildPrefix.prefix;

    if (message.content.replace('!', '').startsWith(`<@${natsuki.user?.id}>`))
    return message.channel.send(Utils.FormatEmoji(`${MESSAGE.MENTIONS["MessageOne"]}`)
    .replace(/<username>|<clientName>|<prefix>/g, (matched, _) => matched == '<username>' ? message.author.username : matched == '<clientName>' ? (natsuki.user?.username ?? "Satsuki") : matched == '<prefix>' ? natsuki.data.prefix : matched));

    if (!message.content.startsWith(natsuki.data.prefix)) return;

    const params = message.content.slice(natsuki.data.prefix.length).trim().split(/ +/g);
    const commandName = params.shift()?.toLocaleLowerCase() as string;
    const command = natsuki.commands.get(commandName) || natsuki.commands.find(als => als.aliases?.includes(commandName));

    if (!command) return;
    if (command.devops && !natsuki.data.devops.includes(message.author.id)) return;

    const mentions = message.mentions.users;
    const userCached = natsuki.users.cache;
    const userFinal = userCached.find(user => params.some(data => user.id as string === data)) || userCached.find(user => params.some(data => user.username === data)) || mentions.first() || message.author;

    const UserDB = await userDB.findById(userFinal?.id);
    const MessageVerify = message.author.id === userFinal?.id ? MESSAGE.DATABASE["MessageAuthor"] : MESSAGE.DATABASE["MessageMentioned"];

    if (command.name !== "verificar" && !UserDB)
    return message.channel.send(Utils.FormatEmoji(MessageVerify
    .replace(/<username>|<command>|<mentioned>/g, (matched, _) => matched === "<username>" ? message.author.username : matched === "<command>" ? `${natsuki.data.prefix}verificar` : matched === "<mentioned>" ? userFinal?.username : matched)));

  }
});