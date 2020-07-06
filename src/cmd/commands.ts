// import { uptime } from './uptime';
// import { ping } from './ping';
// import { roles } from './roles';
// import { about } from './about';
// import { role } from './role';
// import { help } from './help';
// import { stats } from './stats';
import { CommandsType } from '../utils/cmd-def.int';

import { promises } from 'fs';
const { readdir } = promises;

export async function getAllDaCommands() {
	let COMMANDS: any[] = [];
	const find = await readdir(__dirname);
	await find.forEach(file => {
		if (file == 'commands.js') return;
		import(`./${file}`).then(cmd => {
			COMMANDS.push(cmd.default);
		});
	});
	return COMMANDS;
}

// export const CMDS: Array<CommandsType> = [ uptime, ping, roles, about, role, help, stats ];
