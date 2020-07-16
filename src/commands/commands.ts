import { CommandsType } from '../utils/interfaces';
import { promises } from 'fs';
const { readdir } = promises;

/**
 * This file is a promise based function
 * to get all the commands and export them
 * so that other files can use them.
 *
 * Using node's readdir promise, to get all the files.
 */

export const getAllCommands: Promise<CommandsType[] | void> = new Promise(async (resolve, rejects) => {
    const COMMANDS: CommandsType[] = [];
    const find = await readdir(__dirname);
    find.forEach((file: string | string[]) => {
        // If the file is this file, then return, don't do anything
        if (file.includes('commands.')) return;

        if (file.includes('.') == false) {
            let findInFile: Promise<string[]> = new Promise((resolve, rejects) => {
                let files = readdir(`${__dirname}/${file}`);
                resolve(files);
            })

            findInFile.then(val => val.forEach(jsFile => {
                // console.log(jsFile);
                if(jsFile.includes('.') == false) return;

                import(`./${file}/${jsFile}`).then(cmd => {
                        // console.log(cmd.default)
                        COMMANDS.push(cmd.default);
                        // console.log(COMMANDS);
                });
            }));

            return;
        } else {
            import(`./${file}`).then(cmd => {
                COMMANDS.push(cmd.default);
            });
        }

    });

    resolve(COMMANDS);
})

