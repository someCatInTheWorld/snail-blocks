module.exports = {
    root: true,
    extends: ['scratch', 'scratch/es6'],
    env: {
        browser: true
    },
    rules: {
        'valid-jsdoc': 'off',
        'no-case-declarations': 'off',
        'no-console': 'off',
        'no-shadow': 'off',
        'quotes': 'off',
        'prefer-template': 'warn',
        'linebreak-style': 'off',
        'no-alert': 'off',
        'quote-props': 'off',
        'no-trailing-spaces': 'off',
        'object-curly-spacing': 'off',
        'curly': 'off',
        'operator-linebreak': 'off',
        'one-var': 'off',
        'brace-style': 'off',
        'camelcase': 'off'
    },
    "globals": {
        "Blockly": true, // Blockly global
        "goog": true, // goog closure libraries/includes
    },
};