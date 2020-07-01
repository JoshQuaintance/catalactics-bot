import { Message, Client } from 'discord.js';

export interface CommandsType {
    prefix: string,
    args?: string,
    desc: string,
    command: (msg: Message, client?: Client) => void;
}
