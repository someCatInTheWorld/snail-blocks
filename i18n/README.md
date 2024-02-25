# Translation Scripts
**NOTE: PenguinMod uses different scripts as we have a different method for translation.**

These are written for converting the Blockly format to Google Sheets & back.
The Scratch scripts are still used at build time, so we don't remove them.

Run these files with a file path as the argument if needed.

Example: `C:/scratch-blocks/i18n> node create_base_xlsx.js ./my_js_file.js`

## Files
- `messages_fillout.js`
    Creates a JS file that merges English text from `msg/messages.js`
    into every language in `msg/scratch_msgs.js`.

    **NOTE:** This output shouldn't replace the existing text in `msg/scratch_msgs.js`.
    This output is used as input in `create_base_xlsx.js` to create sheets.

- `create_base_xlsx.js`
    Creates an XLSX sheet based on the JS input taken from `msg/scratch_msgs.js` or `messages_fillout.js`.

- `import_xlsx.js`
    Creates a file in the format of `msg/scratch_msgs.js` based on the input XLSX sheet.