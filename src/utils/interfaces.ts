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
interface CommandsArgs {
	client: Client;
	settings: Settings;
	CommandList: CommandsType[];
}

export interface CommandsType {
	prefix: string;
	additionalParam?: string;
	args?: string[];
	examples?: stringElse;
	desc: string;
	category: string;
	alias?: string[];
	//aliasUsed == gives a boolean saying if it's run aliasUsed
	command: (msg: Message, args: CommandsArgs, aliasUsed?: string) => void;
}

/* **** */

/**
 * Database Interfaces
 */
// Commands
export interface CommandsDbInt {
	prefix: string;
	amountCalled: number;
	save: (err: string | never | unknown) => void;
}

//Roles
export interface RolesDbInt {
	serverName: string;
	roleName: string;
	roleId: string;
	rawPosition: number;
	userNum: number;
	desc: string;
	save: (err: string | never | unknown) => void;
}

/* **** */
