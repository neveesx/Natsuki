import { Global } from "../../constants/emojis.json";


export class Utils {
  static FormatEmoji(input: string): string {
    const data = Object.entries(Global);

    return input
    .replace(/{t:(.*?)}/g, (_, emojiName) => `**(${data.find(([name, _]) => name === emojiName)?.[1] || emojiName}) ~**`)
    .replace(/{s:(.*?)}/g, (_, emojiName) => `**(${data.find(([name, _]) => name === emojiName)?.[1] || emojiName}) ›**`)
    .replace(/{(.*?)}/g, (_, emojiName) => data.find(([name, _]) => name === emojiName)?.[1] || emojiName)
  }
}