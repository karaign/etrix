/**
 * Represents a single token placed within a string.
 */
export interface Token {
  kind: string,
  pos: number,
  stringRepr: string
}

/**
 * Object containing all valid tokens in the language.
 * Keys correspond to token names.
 * Values are regexps that will match the corresponding token
 * at the beginning of a string.
 * */
export const TOKENS: {
  [key: string]: RegExp
} = {
// Name
  'PLUS':        /^\+/,
  'TIMES':       /^\*/,
  'OPEN_PAREN':  /^\(/,
  'CLOSE_PAREN': /^\)/,
  'INTEGER':     /^\d+/,
  'IDENTIFIER':  /^[a-zA-Z][a-zA-Z\d]*/
}

