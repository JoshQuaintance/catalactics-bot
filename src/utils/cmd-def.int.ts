import { Message, Client } from 'discord.js';
import { Settings } from './get-settings';

export interface CommandsArgs {
    client: Client;
    settings: Settings;
    CMD: CommandsType[];
}

export interface CommandsType {
    prefix: string;
    additionalParam?: string;
    args?: string | {}[];
    desc: string;
    command: (msg: Message, args: CommandsArgs) => void;
}
