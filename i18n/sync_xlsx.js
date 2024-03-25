const fs = require('fs');
const xlsx = require('xlsx');

console.log('Parsing files');

const filePath = process.argv[2];
if (!filePath) {
    throw new Error("No file path specified");
}
const workbook = xlsx.readFile(filePath);

const getLanguageCode = (inputString) => {
    const parts = inputString.split('|');
    if (parts.length === 2) {
        return parts[1].trim();
    }
}

const writeEnFiles = (json) => {
    console.log('writing en.json');
    fs.writeFileSync('../msg/json/en.json', JSON.stringify(json, null, 4), 'utf8');

    console.log('writing en.js');
    let fileText = `// This file was automatically generated.  Do not modify.

'use strict';

goog.provide('Blockly.Msg.en');
goog.require('Blockly.Msg');

`;
    for (const key in json) {
        const value = json[key];
        fileText += `Blockly.Msg[${JSON.stringify(key)}] = ${JSON.stringify(value)};\n`
    }
    fs.writeFileSync('../msg/js/en.js', fileText, 'utf8');
};

const CombinedObject = {};
for (const sheetName of workbook.SheetNames) {
    const languageCode = getLanguageCode(sheetName);
    console.log('parsing', languageCode);

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const keyValuePairs = {};
    for (const pair of jsonData) {
        const key = pair['Translation Keys'];
        const value = pair['Translated Text'];
        if (key.startsWith('--')) continue;
        keyValuePairs[key] = value;
    }
    CombinedObject[languageCode] = keyValuePairs;

    if (languageCode === 'en') {
        writeEnFiles(keyValuePairs);
    }
}

console.log('writing scratch_msgs.js');
let msgsfileText = `// This file was automatically generated.  Do not modify.

'use strict';

goog.provide('Blockly.ScratchMsgs.allLocales');

goog.require('Blockly.ScratchMsgs');

`;
for (const langCode in CombinedObject) {
    const language = CombinedObject[langCode];
    msgsfileText += `\nBlockly.ScratchMsgs.locales[${JSON.stringify(langCode)}] =\n`
    msgsfileText += `${JSON.stringify(language, null, 4)};\n`;
}
msgsfileText += `// End of combined translations\n`;
fs.writeFileSync('../msg/scratch_msgs.js', msgsfileText, 'utf8');