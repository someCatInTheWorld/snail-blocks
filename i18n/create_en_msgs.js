const fs = require('fs');

const linePrefix = 'Blockly.Msg';
console.log('Parsing files');

const EnMessages = fs.readFileSync('../msg/messages.js', 'utf8');
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

// write en.json because its just json.stringify
console.log('writing json file');
fs.writeFileSync('../msg/output/en.json', JSON.stringify(EnObject, null, 4), 'utf8');

// write en.js
console.log('writing en.js');
let fileText = `// This file was automatically generated.  Do not modify.

'use strict';

goog.provide('Blockly.Msg.en');
goog.require('Blockly.Msg');

`;
for (const key in EnObject) {
    const value = EnObject[key];
    fileText += `Blockly.Msg[${JSON.stringify(key)}] = ${JSON.stringify(value)};\n`
}
fs.writeFileSync('../msg/output/en.js', fileText, 'utf8');