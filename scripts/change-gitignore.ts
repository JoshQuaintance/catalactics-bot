
import { stripIndents } from 'common-tags';

let dataToAppend = stripIndents`
# Ignore everything
*

# Except for the README
!README.md
`

import('fs').then(async fs => {
    fs.writeFileSync('.gitignore', dataToAppend);
    console.log("Done")
})

/**
 * My original GitIgnore files
 * /node_modules/
 * /.vscode/
 * /dist
 * *.env
 * *.gpg
 */
