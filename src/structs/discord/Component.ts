import { ComponentType, ComponentData, ComponentProps } from "../types/Component"

export default class ComponentBuilder<T extends ComponentType> {
    declare customId: string
    declare type: T
    declare runner: (interaction: ComponentProps<T>, params: string[]) => any | Promise<any>;
    public constructor(data: ComponentData<T>) {
        Object.assign(this, data);
    }
}