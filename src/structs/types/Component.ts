import { ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction } from "discord.js";

export type ComponentType = "button" | "selectmenu" | "modal" | "all";

export type ComponentProps<T extends ComponentType> =
  T extends "button" ? ButtonInteraction :
  T extends "selectmenu" ? StringSelectMenuInteraction :
  T extends "modal" ? ModalSubmitInteraction :
  T extends "all" ? ButtonInteraction & StringSelectMenuInteraction & ModalSubmitInteraction :
  never;

export interface ComponentData<T extends ComponentType> {
    customId: string;
    type: T;
    runner?: (interaction: ComponentProps<T>, params: string[]) => any | Promise<any>;
}