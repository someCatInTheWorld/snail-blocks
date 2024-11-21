const fs = require('fs');

const processArgs = process.argv;
processArgs.shift(); // node exe
processArgs.shift(); // script file
const scratchMsgsFile = fs.readFileSync(processArgs.shift(), 'utf8');
const combinedObject = (() => {
    const goog = {
        provide: () => { },
        require: () => { },
    };
    const Blockly = {
        ScratchMsgs: {
            locales: {}
        }
    };
    eval(scratchMsgsFile.replace("'use strict';", ''));
    return Blockly.ScratchMsgs.locales;
})();

const enLanguage = combinedObject['en'];
if (!enLanguage) throw 'no english language';

for (const key of processArgs) {
    for (const langCode in combinedObject) {
        const language = combinedObject[langCode];
        language[key] = enLanguage[key];
    }
}

console.log('Saving to file...');
let fileText = `// This file was automatically generated.  Do not modify.

'use strict';

goog.provide('Blockly.ScratchMsgs.allLocales');

goog.require('Blockly.ScratchMsgs');

`;
for (const langCode in combinedObject) {
    const language = combinedObject[langCode];
    fileText += `\nBlockly.ScratchMsgs.locales[${JSON.stringify(langCode)}] =\n`
    fileText += `${JSON.stringify(language, null, 4)};\n`;
}
fileText += `// End of combined translations\n`;
fs.writeFileSync('../msg/output/override_scratch_msgs.js', fileText, 'utf8');