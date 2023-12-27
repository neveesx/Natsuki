import { BitFieldResolvable, Client, ClientEvents, Collection, GatewayIntentsString, IntentsBitField } from "discord.js";
import { NatsukiData } from "../types/NatsukiData";
import { ComponentType } from "../types/Component";
import { EventType } from "../types/Event";
import fs from "fs";
import path from "path";
import colors from "colors"
import Command from "./Command";
import Component from "./Component"

const filterFiles = (Files: string) => Files.endsWith(".js") || Files.endsWith(".ts");

export default class Natsuki extends Client {
    public commands: Collection<string, Command> = new Collection();
    public components: Collection<string, Component<ComponentType>> = new Collection()

    public constructor(public data: NatsukiData) {
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
        });
    };

    public ready() {
        this.FilesCommand();
        this.FilesComponent();
        this.FilesEvent()
        super.login(this.data.token)
        .then(() => {
            console.log('🌻 ~', colors.yellow.bold(this.user?.username as string), 'conectada com sucesso!');
        })
        .catch((err) => {
            console.error(colors.red('Um erro ocorreu ao se conectar ao client'), err)
        })
    }
    
    private FilesCommand() {
        fs.readdirSync('./src/discord/commands')
        .forEach(Local => {
            fs.readdirSync(`./src/discord/commands/${Local}`).filter(filterFiles)
            .forEach(async Files => {
                const command: Command = (await import(`../../discord/commands/${Local}/${Files}`)).default;
                if (!command) return;
                this.commands.set(command.name, command);
                console.log(`${colors.magenta.bold(command.name)}: commands[${Files}] - ${colors.green('sucesso')}`)
            })
        })
    }

    private FilesComponent() {
        fs.readdirSync('./src/discord/components')
        .forEach(Local => {
            fs.readdirSync(`./src/discord/components/${Local}`).filter(filterFiles)
            .forEach(async Files => {
                const components: Component<ComponentType> = (await import(`../../discord/components/${Local}/${Files}`)).default;
                if (!components) return;
                this.components.set(components.customId, components);
                console.log(`${colors.black.bold(components.customId)}: components[${Files} | ${components.type}] - ${colors.green('sucesso')}`)
            })
        })
    }

    private FilesEvent() {
        fs.readdirSync('./src/discord/events').filter(filterFiles)
        .forEach(async Files => {
            const events: EventType<keyof ClientEvents> = (await import(`../../discord/events/${Files}`)).default
            if (events.type) (events.once) ? this.once(events.type, events.runner) : this.on(events.type, events.runner);
            console.log(`${colors.rainbow(events.type)}: events[${Files}] - ${colors.green('sucesso')}`)
        })
    }
}