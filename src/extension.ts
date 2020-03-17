// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import cleancss = require('clean-css');
const kDefaultCleanOptions = {
    // level: 0, // no optimizations
    level: {
        1: {
            removeEmpty: true, // controls removing empty rules and nested blocks; defaults to `true`,
            specialComments: 'all',
        }
    },
    format: {
        breaks: {
            // controls where to insert breaks
            //afterAtRule: false, // controls if a line break comes after an at-rule; e.g. `@charset`; defaults to `false`
            //afterBlockBegins: false, // controls if a line break comes after a block begins; e.g. `@media`; defaults to `false`
            //afterBlockEnds: false, // controls if a line break comes after a block ends, defaults to `false`
            afterComment: true, // controls if a line break comes after a comment; defaults to `false`
            //afterProperty: false, // controls if a line break comes after a property; defaults to `false`
            //afterRuleBegins: false, // controls if a line break comes after a rule begins; defaults to `false`
            afterRuleEnds: true, // controls if a line break comes after a rule ends; defaults to `false`
            //beforeBlockEnds: false, // controls if a line break comes before a block ends; defaults to `false`
            betweenSelectors: false // controls if a line break comes between selectors; defaults to `false`
        },
        //breakWith: '\n', // controls the new line character, can be `'\r\n'` or `'\n'` (aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`); defaults to system one, so former on Windows and latter on Unix
        indentBy: 2, // controls number of characters to indent with; defaults to `0`
        //indentWith: 'space', // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
        //spaces: { // controls where to insert spaces
        //aroundSelectorRelation: false, // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
        //beforeBlockBegins: false, // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
        //beforeValue: false // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
        //},
        wrapAt: 120, // controls maximum line length; defaults to `false`
        //semicolonAfterLastProperty: false // controls removing trailing semicolons in rule; defaults to `false` - means remove
    }
};

export function formatCSS(document: vscode.TextDocument, range: vscode.Range | null, options: vscode.FormattingOptions) {
    if (range === null) {
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        range = new vscode.Range(start, end);
    }
    let result: vscode.TextEdit[] = [];

    let formatted = new cleancss(kDefaultCleanOptions).minify(document.getText(range));
    if (formatted) {
        result.push(new vscode.TextEdit(range, formatted.styles));
    }
    return result;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('css', {
        provideDocumentFormattingEdits: (document, options, token) => {
            return formatCSS(document, null, options)
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('css', {
        provideDocumentRangeFormattingEdits: (document, range, options, token) => {
            let start = new vscode.Position(0, 0);
            let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            return formatCSS(document, new vscode.Range(start, end), options)
        }
    }));
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-css-clean-formatter" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() { }
