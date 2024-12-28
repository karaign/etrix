import { Token, TOKENS } from "./tokens.ts";
import { ParseError } from "../errors.ts";

/**
 * A single-pass tokenizing scanner that will
 * produce one token at a time from an input string.
 */
export class Scanner {
  /**
   * The input string.
   */
  private readonly input: string;

  /**
   * The current position of the scanner, i.e.
   * the index of the next character that will be read.
   */
  private pos: number = 0;

  /**
   * A preview of the next token to be consumed.
   */
  private peek: Token | null = null;

  /**
   * Creates a new Scanner instance.
   * @param input - the string to be scanned
   */
  constructor(input: string) {
    this.input = input;
    this.readToken();
  }

  /**
   * Returns the next character to be read.
   */
  private ch(): string {
    return this.input[this.pos];
  }

  /**
  * Reads one token and stores it in this.peek,
  * WITHOUT consuming it.
  * Skips whitespace when encountered.
  */
  private readToken() {
    // Handle whitespace
    this.skipWhitespace();

    // Handle EOF
    if (!this.ch()) {
      this.peek = null;
      return;
    }

    const start = this.pos;
    // Test against known token kinds until we find
    // one for which this.input[this.pos] is a valid beginning character.
    // Keep reading valid non-beginning characters until we hit one that isn't.
    for (const [name, regex] of Object.entries(TOKENS)) {
      // Try matching regex to substring beginning at this.pos
      const match = regex.exec(this.input.substring(this.pos));
      if (match) {
        this.pos += match[0].length;
        // Update this.peek with the newly read token
        this.peek = {
          kind: name,
          pos: start,
          stringRepr: match[0]
        }
        return;
      }
    }
    // If no token matched the current character, we're stuck.
    // This shouldn't happen in the final version, but for now...
    throw new ParseError(`Don't know what to do with character ${this.ch()} at index ${this.pos}`);
  }

  /**
   * If the current character is a whitespace character,
   * advances `pos` until that is no longer the case.
   * Comments are treated as whitespace.
   */
  private skipWhitespace() {
    const LINE_COMMENT = '#';
    const BEGIN_COMMENT = '/*';
    const END_COMMENT = '*/';

    const checkDelim = (delim: string) => this.input.slice(this.pos, this.pos + delim.length) == delim;

    while (true) {
      // Handle whitespace charactes
      if (/\s/.test(this.ch())) {
        this.pos++;
      // Handle single line comments
      } else if (this.ch() == LINE_COMMENT) {
        while (this.ch() && this.ch() != '\n') {
          this.pos++;
        }
      // Handle delimited comments (comments don't nest)
      } else if (checkDelim(BEGIN_COMMENT)) {
        const start = this.pos;
        while (!checkDelim(END_COMMENT)) {
          this.pos++;
          if (!this.ch())
            throw new ParseError(`Comment was opened at ${start} and never closed`)
        }
        this.pos += END_COMMENT.length;
      // pos no longer points to whitespace or a comment, we're done
      } else {
        break;
      }
    }
  }

  /**
   * Consumes and returns the next token and
   * prepares the token after that, if any.
   */
  nextToken() {
    const token = this.peek;
    this.readToken();
    return token;
  }

  /**
   * Runs the callback function with the assumption that it will consume
   * some number of tokens. If the next token after is a specified
   * delimiter, does the same thing again. If not, returns.
   *
   * @param delimiter The internal name of the kind of delimited we're looking for.
   * @param callback The function to defer to.
   */
  split(delimiter: string, callback: () => void) {
    while (true) {
      callback();
      if (this.peek && this.peek.kind == delimiter) {
        this.nextToken()
      } else {
        break;
      }
    }
  }

  /**
   * Returns the next token that will be consumed
   * upon calling nextToken(), or null if no tokens are left.
   */
  getPeek() {
    return this.peek;
  }

  /**
  * Returns true if there are no characters left to read.
  */
  isEOF() {
    return !this.ch();
  }
}
