const fs = require('fs');

const linePrefix = 'Blockly.Msg';
console.log('Parsing files');

const EnMessages = fs.readFileSync('../msg/messages.js', 'utf8');
const CombinedMessages = fs.readFileSync('../msg/scratch_msgs.js', 'utf8');

const CombinedObject = (() => {
    const goog = {
        provide: () => {},
        require: () => {},
    };
    const Blockly = {
        ScratchMsgs: {
            locales: {}
        }
    };
    eval(CombinedMessages.replace("'use strict';", ''));
    return Blockly.ScratchMsgs.locales;
})();
const EnObject = (() => {
    const EnParsable = EnMessages.split('\n')
        .filter(line => line.startsWith(linePrefix))
        .join('\n');
    const Blockly = {
        Msg: {}
    };
    eval(EnParsable);
    return Blockly.Msg;
})();

console.log('filling');

// merge english if the keys dont exist in the lang
for (const langCode in CombinedObject) {
    const language = CombinedObject[langCode];
    for (const key in EnObject) {
        if (!(key in language)) {
            language[key] = EnObject[key];
            console.log('filled', langCode, 'missing', key);
        }
    }
}
// english should match english obj
CombinedObject['en'] = EnObject;

console.log('Saving to file...');
let fileText = `// This file was automatically generated.  Do not modify.

'use strict';

goog.provide('Blockly.ScratchMsgs.allLocales');

goog.require('Blockly.ScratchMsgs');

`;
for (const langCode in CombinedObject) {
    const language = CombinedObject[langCode];
    fileText += `\nBlockly.ScratchMsgs.locales[${JSON.stringify(langCode)}] =\n`
    fileText += `${JSON.stringify(language, null, 4)};\n`;
}
fileText += `// End of combined translations\n`;
fs.writeFileSync('../msg/output/filled_scratch_msgs.js', fileText, 'utf8');