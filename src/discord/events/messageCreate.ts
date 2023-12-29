import { Utils } from "../../structs/others/Utils";
import { EventBuilder } from "../../structs/discord/Event";
import MESSAGE from '../../constants/messages.json'
import { PermissionResolvable } from "discord.js";
import { guildDB, userDB } from "../../database";
import { Perms } from "../../constants/permissions.json"
import { natsuki } from "../..";

const cooldowns = new Map();
const PermsTranslated = (Permissions: PermissionResolvable[]) => {
    return Permissions.map(data => `\` ${Perms[data as keyof typeof Perms]} \`` || Perms).join(", ")
};

export default new EventBuilder({
    type: "messageCreate",
    runner: async (message) => {
        if (!message.guild || message.author.bot) return;

        let GuildDB = await guildDB.findOne({ _id: message.guild.id });
        if (!GuildDB) GuildDB = await guildDB.create({ _id: message.guild.id });
        natsuki.data.prefix = GuildDB.prefix

        if (message.content.replace("!", "").startsWith(`<@${natsuki.user?.id}>`))
        return message.channel.send(Utils.FormatEmoji(`${MESSAGE.MENTIONS["MessageOne"]}`)
        .replace(/<username>|<clientName>|<prefix>/g, (matched, _) => matched == '<username>' ? message.author.username : matched == '<clientName>' ? (natsuki.user?.username ?? "Satsuki") : matched == '<prefix>' ? natsuki.data.prefix : matched));

        if (!message.content.startsWith(natsuki.data.prefix)) return;

        const params = message.content.slice(natsuki.data.prefix.length).trim().split(/ +/g);
        const commandName = params.shift()?.toLowerCase() as string;
        const command = natsuki.commands.get(commandName) || natsuki.commands.find(als => als.aliases?.includes(commandName));
        
        if (!command) return;

        // verifica se o comando e exlusivo de desenvolvedores é se o usuário e um desenvolvedor
        if (command.data?.devops && !natsuki.data.devops.includes(message.author.id))
        return message.react(Utils.FormatEmoji(`{cancel}`));
        
        // Buscando o usuário atravês da menção|nome de usuário|id
        const mentionedUser = Utils.mentionedUser(params, message, natsuki);

        // Buscando os dados do author da mensagem é do usuário mencionado.
        const mentionedDB = await userDB.findById(mentionedUser?.id);
        const authorDB = await userDB.findById(message.author.id);

        // variaveis de mensagem de Verificação & Blacklist
        const messageDB = !authorDB ? MESSAGE.DATABASE["MessageAuthor"] : MESSAGE.DATABASE["MessageMentioned"];
        const equalAuthor = authorDB?.Blacklisted?.reason ? 'você' : `o usuário **${mentionedUser?.username}**`;
        const blTimestamp = authorDB?.Blacklisted?.timestamp / 1000 || mentionedDB?.Blacklisted?.timestamp / 1000;

        // variaveis de verificação de permissão do autor & Natsuki
        const natHasPermission = message.guild.members.cache.get(natsuki.user?.id as string)?.permissions.has(command.permissions?.client || [])
        const authorPermission = message.member?.permissions.has(command.permissions?.author || [])

        // Verifica se o autor da mensagem ou usuário mencionado possui dados no banco de dados.
        if (command.name !== "verificar" && (!authorDB || !mentionedDB))
        return message.channel.send(Utils.FormatEmoji(messageDB
        .replace(/<username>|<prefix>|<mentioned>/g, (matched, _) => matched === "<username>" ? message.author.username : matched === "<prefix>" ? natsuki.data.prefix : matched === "<mentioned>" ? mentionedUser?.username || '' : matched)));

        // Verifica se o autor da mensagem ou usuário mencionado está banido da utilização dos comandos.
        if (authorDB?.Blacklisted["timestamp"] || mentionedDB?.Blacklisted["timestamp"])
        return message.channel.send(Utils.FormatEmoji(MESSAGE.BLACKLISTED["MessageBanned"]
        .replace(/<username>|<mention>/g, (matched, _) => matched === "<username>" ? message.author.username : matched === "<mention>" ? equalAuthor : matched)
        .replace(/<timestampf>|<timestampR>/g, (matched, _) => matched === "<timestampf>" ? `<t:${~~(blTimestamp)}:f>` : matched === "<timestampR>" ? `<t:${~~(blTimestamp)}:R>` : matched)));

        // verifica se a Natsuki possui as permissòes necessárias para a execução do comando.
        if (command.permissions?.client && !natHasPermission)
        return message.channel.send(Utils.FormatEmoji(MESSAGE.PERMISSIONS["MessageClient"])
        .replace(/<username>|<permissions>/g, (matched, _) => matched === "<permissions>" ? PermsTranslated(command.permissions?.client || []) : matched === "<username>" ? message.author.username : matched));

        // verifica se o autor da mensagem possui as permissões necessárias para a execução do comando.
        if (command.permissions?.author && !authorPermission)
        return message.channel.send(Utils.FormatEmoji(MESSAGE.PERMISSIONS["MessageAuthor"])
        .replace(/<username>|<permissions>/g, (matched, _) => matched === "<permissions>" ? PermsTranslated(command.permissions?.author || []) : matched === "<username>" ? message.author.username : matched));

        // Variavel para pegar o tempo do cooldown em segundos
        const msCooldown = cooldowns.get(`NatCooldown-${message.author.id}`) / 1000;

        // verifica se o usuário está em modo de espera é se o usuário não é um desenvolvedor
        if (cooldowns.has(`NatCooldown-${message.author.id}`) /*&& !natsuki.data.devops.includes(message.author.id)*/)
        return message.channel.send(Utils.FormatEmoji(MESSAGE.COOLDOWN["Message"])
        .replace(/<username>|<cooldown>/g, (matched, _) => matched === "<cooldown>" ? `<t:${~~(msCooldown)}:R>` : matched === "<username>" ? message.author.username : matched));

        // coloca o usuário em modo de espera após a utilização de um comando
        cooldowns.set(`NatCooldown-${message.author.id}`, Date.now() + 5000);
        setTimeout(() => { cooldowns.delete(`NatCooldown-${message.author.id}`)}, 5000);

        // try/catch para capturar erros durante a execução do comando.
        try {
            command.runner(natsuki, message, params);
        } catch (err) {
            console.error(err);
        }
  }
})