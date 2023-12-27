import { Utils } from "../../structs/others/Utils";
import { natsuki } from "../..";
import { EventBuilder } from "../../structs/discord/Event";
import MESSAGE from '../../constants/messages.json'
import { guildDB } from "../../database";

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



  }
});