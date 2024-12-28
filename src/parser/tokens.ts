/**
 * Represents a single token placed within a string.
 */
export interface Token {
  kind: string,
  pos: number,
  stringRepr: string
}

/**
 * Represents a specific kind of token,
 * i.e. a number literal or an opening parenthesis.
 * Provides methods for testing whether a character
 * is a valid beginning or non-beginning character
 * for this type of token.
 */
export interface TokenKind {
  /**
   * The internal identifier for this kind of token.
   * Should be SNAKE_CASE_ALL_CAPS.
   */
  name: string;
  /**
   * Test whether `ch` is a valid beginning character
   * for this type of token.
   *
   * @param ch - must be 1 character long.
   */
  fChar: (ch: string) => boolean;
  /**
   * Thest whether `ch` is a valid non-beginning chracter
   * for this type of token.
   *
   * @param ch - must be 1 character long.
   */
  nChar: (ch: string) => boolean;
}

/// Token definitions go here ///
const TOKENS: {
  [key: string]: [(ch: string) => boolean, (ch: string) => boolean]
} = {
// Name          Beginning character test    Non-beginning character test
  'PLUS':        [ch => ch == '+',           _  => false],
  'TIMES':       [ch => ch == '*',           _  => false],
  'OPEN_PAREN':  [ch => ch == '(',           _  => false],
  'CLOSE_PAREN': [ch => ch == ')',           _  => false],
  'INTEGER':     [ch => /\d/.test(ch),       ch => /\d/.test(ch)],
  'IDENTIFIER':  [ch => /[a-zA-Z]/.test(ch), ch =>/[a-zA-Z]|\d/.test(ch)]
}


interface TokenKindList {
  [key: string]: TokenKind
}

/**
 * Contains every available kind of token in the language.
 */
export const tokenKinds: TokenKindList = {};

// Populate TokenKinds
for (const name in TOKENS) {
  tokenKinds[name] = {name: name, fChar: TOKENS[name][0], nChar: TOKENS[name][1]};
}

