import { Message, Client } from 'discord.js';
import { Settings } from './get-settings';

export interface CommandsArgs {
    client: Client;
    settings: Settings;
    CMD: CommandsType[];
}

interface argsArguments {
    options: string;
    arguments?: string | string[] | undefined;
}

export interface CommandsType {
    prefix: string;
    additionalParam?: string;
    args?: argsArguments[];
    examples?: string | string[] | undefined;
    desc: string;
    command: (msg: Message, args: CommandsArgs) => void;
}
