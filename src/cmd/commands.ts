import { uptime } from './uptime';
import { ping } from './ping';
import { roles } from './roles';
import { about } from './about';
import { role } from './role';
import { help } from './help';
import { stats } from './stats';
import { CommandsType } from '../utils/cmd-def.int';

export const CMD: Array<CommandsType> = [
    uptime, ping, roles, about, role, help, stats
]
