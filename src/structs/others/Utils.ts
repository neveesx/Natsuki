import { Message, User } from "discord.js";
import { Global } from "../../constants/emojis.json";
import Natsuki from "../../structs/discord/NatsukiClient";


export class Utils {
  static FormatEmoji(input: string): string {
    const data = Object.entries(Global);

    return input
    .replace(/{t:(.*?)}/g, (_, emojiName) => `**(${data.find(([name, _]) => name === emojiName)?.[1] || emojiName}) ~**`)
    .replace(/{s:(.*?)}/g, (_, emojiName) => `**(${data.find(([name, _]) => name === emojiName)?.[1] || emojiName}) ›**`)
    .replace(/{(.*?)}/g, (_, emojiName) => data.find(([name, _]) => name === emojiName)?.[1] || emojiName)
  }

  static mentionedUser(params: string[], message: Message, client: Natsuki) {
    const mentions = message.mentions.users;
    const userCached = client.users.cache;
    const SearchUser = mentions.first() || userCached.find(user => params.some(data => user.id as string === data)) || userCached.find(user => params.some(data => user.username === data)) || message.author;
    return SearchUser
  }
}