import { Message, Client } from 'discord.js';
import { Settings } from './get-settings';

/**
 * Custom Types
 */
type stringElse = string | string[] | undefined;

/* **** */

/**
 * Commands Interfaces
 */
interface CommandsArgs
{
    client: Client;
    settings: Settings;
    CommandList: CommandsType[];
}

interface argsArguments
{
    options: string;
    arguments?: stringElse;
}

export interface CommandsType
{
    prefix: string;
    additionalParam?: string;
    args?: argsArguments[];
    examples?: stringElse;
    desc: string;
    category: string;
    command: (msg: Message, args: CommandsArgs) => void;
}

/* **** */

/**
 * Database Interfaces
 */
// Commands
export interface CommandsDbInt
{
    prefix: string;
    amountCalled: number;
    save: (err: any) => void;
}

//Roles
export interface RolesDbInt
{
    serverName: string,
	roleName: string,
	roleId: string,
	rawPosition: number,
	userNum: number,
    desc: string,
    save: (err: any) => void;
}

/* **** */
