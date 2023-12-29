import { userDB } from "../../../database";
import CommandBuilder from "../../../structs/discord/Command";

export default new CommandBuilder({
    name: "bl",
    infos: {
        category: "",
        description: "",
        usage: "",
    },
    permissions: {
        author: ["BanMembers"]
    },
    runner: async (client, message, params) => {
        const user = message.mentions.users.first();
        if (!user) return message.react("❌");
        await userDB.updateOne({ _id: user.id }, {
            $set: {
                Blacklisted: {
                    timestamp: Date.now(),
                    reason: "Testando o evento de mensagem."
                }
            }
        })
        .then(() => message.react("✅"));
    }
})