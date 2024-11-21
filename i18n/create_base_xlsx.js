const fs = require('fs');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');

console.log('Parsing files');

const filePath = process.argv[2];
if (!filePath) {
    throw new Error("No file path specified");
}
const CombinedMessages = fs.readFileSync(filePath, 'utf8');

const CombinedObject = (() => {
    const goog = {
        provide: () => { },
        require: () => { },
    };
    const Blockly = {
        ScratchMsgs: {
            locales: {}
        }
    };
    eval(CombinedMessages.replace("'use strict';", ''));
    return Blockly.ScratchMsgs.locales;
})();

const languageMapping = {
    'ab': 'Abkhazian',
    'af': 'Afrikaans',
    'am': 'Amharic',
    'an': 'Aragonese',
    'ar': 'Arabic',
    'ast': 'Asturian',
    'az': 'Azerbaijani',
    'id': 'Indonesian',
    'bn': 'Bengali',
    'be': 'Belarusian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'cs': 'Czech',
    'cy': 'Welsh',
    'da': 'Danish',
    'de': 'German',
    'et': 'Estonian',
    'el': 'Greek',
    'en': 'English',
    'es': 'Spanish',
    'es-419': 'Latin American Spanish',
    'eo': 'Esperanto',
    'eu': 'Basque',
    'fa': 'Persian',
    'fil': 'Filipino',
    'fr': 'French',
    'fy': 'Frisian',
    'ga': 'Irish',
    'gd': 'Scottish Gaelic',
    'gl': 'Galician',
    'ko': 'Korean',
    'ha': 'Hausa',
    'hy': 'Armenian',
    'he': 'Hebrew',
    'hr': 'Croatian',
    'xh': 'Xhosa',
    'zu': 'Zulu',
    'is': 'Icelandic',
    'it': 'Italian',
    'ka': 'Georgian',
    'kk': 'Kazakh',
    'qu': 'Quechua',
    'sw': 'Swahili',
    'ht': 'Haitian Creole',
    'ku': 'Kurdish',
    'ckb': 'Central Kurdish',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'hu': 'Hungarian',
    'mi': 'Maori',
    'mn': 'Mongolian',
    'nl': 'Dutch',
    'ja': 'Japanese',
    'ja-Hira': 'Japanese (Hiragana)',
    'nb': 'Norwegian Bokmål',
    'nn': 'Norwegian Nynorsk',
    'oc': 'Occitan',
    'or': 'Oriya',
    'uz': 'Uzbek',
    'th': 'Thai',
    'km': 'Khmer',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pt-br': 'Brazilian Portuguese',
    'rap': 'Rapanui',
    'ro': 'Romanian',
    'ru': 'Russian',
    'nso': 'Northern Sotho',
    'tn': 'Tswana',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'sr': 'Serbian',
    'fi': 'Finnish',
    'sv': 'Swedish',
    'vi': 'Vietnamese',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)'
};

const workbook = xlsx.utils.book_new();
const defaultContent = () => {
    return [
        ['Translation Keys', 'Translated Text'],
        ['--notes1', 'This key and any other keys starting with -- do not need translation.'],
        ['--notes2', 'Please do not rename the sheet or change the text on the first row of the sheet.'],
        ['--notes3', 'Please do not change any text in the Translation Keys column.'],
        ['--notes4', 'Any text containing %1 or %2 or any numbers after a % symbol will replace those symbols on the website with something else.'],
    ];
};
const highlightedRows = {};
for (const languageCode in CombinedObject) {
    // if (languageCode !== 'ab') continue;

    const languageObject = CombinedObject[languageCode];
    const workbookParsable = ` | ${languageCode}`;
    const workbookName = (languageMapping[languageCode] || `Language ${languageCode}`) + workbookParsable;
    highlightedRows[languageCode] = [];

    console.log('writing', workbookName);

    // Create a worksheet
    const content = defaultContent();
    let idx = content.length + 1;
    for (const key in languageObject) {
        const value = languageObject[key];
        if (value === CombinedObject['en'][key] && languageCode !== 'en') {
            highlightedRows[languageCode].push(idx);
        }

        content.push([key, value]);
        idx++;
    }
    const worksheet = xlsx.utils.aoa_to_sheet(content);

    const columnWidths = [
        { wch: 45 }, // Width of keys column
        { wch: 200 }, // Width of text column
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, workbookName);
}

// Write the workbook to a file
console.log('writing XLSX no color...');
const outputPath = '../msg/output/basesheet.xlsx';
xlsx.writeFile(workbook, outputPath);

// ExcelJS handles colors because google sheets cant tell when xlsx does it
const redColor = 'FFEA9999';
const yellowColor = 'FFFFE599';
const generateFillForColor = (col) => {
    return {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: col }
    };
};

console.log('coloring XLSX...');
const exxworkbook = new ExcelJS.Workbook();
exxworkbook.xlsx.readFile(outputPath)
    .then(() => {
        exxworkbook.eachSheet((worksheet, sheetId) => {
            const languageCode = worksheet.name.split(' | ')[1];
            for (let rowIndex = 2; rowIndex <= 5; rowIndex++) {
                const cell1 = worksheet.getCell(rowIndex, 1);
                const cell2 = worksheet.getCell(rowIndex, 2);
                cell1.fill = generateFillForColor(redColor);
                cell2.fill = generateFillForColor(redColor);
            }
            const highlights = highlightedRows[languageCode];
            if (highlights && highlights.length >= 1) {
                for (const rowIndex of highlights) {
                    const cell1 = worksheet.getCell(rowIndex, 1);
                    const cell2 = worksheet.getCell(rowIndex, 2);
                    cell1.fill = generateFillForColor(yellowColor);
                    cell2.fill = generateFillForColor(yellowColor);
                }
            }
        });

        // Write the modified file
        console.log('writing XLSX with color...');
        return exxworkbook.xlsx.writeFile(outputPath);
    });