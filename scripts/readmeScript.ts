import { updateReadme } from '../src/index';

// The flag will be where the README is
const flags = process.argv.slice(2);


(async function hello() {
    await updateReadme(flags);
})();
