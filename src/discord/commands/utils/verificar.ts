import { userDB } from "../../../database";
import CommandBuilder from "../../../structs/discord/Command";

export default new CommandBuilder({
    name: "verificar",
    infos: {
        category: "",
        description: "",
        usage: "",
    },
    runner: async (client, message, params) => {
        const registered = await userDB.findOne({ _id: message.author.id });
        if (registered) return message.react("❌");
        await userDB.create({ _id: message.author.id })
        .then(() => message.react('✅'));
    }
})