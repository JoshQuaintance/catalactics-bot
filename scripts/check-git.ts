import { readFile } from 'fs';

readFile('./catalactics-bot-docs/.git/config', 'utf-8', (err, data) => {
    console.log(data);
})
