import { ParseError } from "../errors.ts";
import { Scanner } from "./scanner.ts";

export type Op = '+' | '*';
export type Atom = number | string;
export type Expr = Atom | [Op, ...Expr[]]

function parseExpr(sc: Scanner): Expr {
  const sum: Expr = ['+'];
  // Build up sum
  sc.split('PLUS', () => {
    // Build up product
    const prod: Expr = ['*'];
    sc.split('TIMES', () => {
      const peek = sc.getPeek();
      if (!peek) {
        throw new ParseError(`Expected expression, got EOF`);
      }
      const start = peek.pos;
      // Handle nested expressions
      if (peek.kind == 'OPEN_PAREN') {
        sc.nextToken(); // consume (
        prod.push(parseExpr(sc)); // recursively handle subexpr
        const peek = sc.getPeek();

        if (!peek)
          throw new ParseError(`Unclosed parenthesis starting at ${start}`);

        if (peek.kind != 'CLOSE_PAREN')
          throw new ParseError(`Expected CLOSE_PAREN but got ${peek.kind} at index ${peek.pos}`);

        sc.nextToken() // consume )
      } else if (peek.kind == 'INTEGER') {
        prod.push(Number.parseInt(sc.nextToken()!.stringRepr));
      } else if (peek.kind == 'IDENTIFIER') {
        prod.push(sc.nextToken()!.stringRepr);
      }
    });
    sum.push(prod);
  });
  return sum;
}


export function parse(input: string): Expr {
  const sc = new Scanner(input);
  const out = parseExpr(sc);

  const peek = sc.getPeek();
  if (peek)
    throw new ParseError(`Expected EOF, got ${peek.kind} at ${peek.pos}`);

  return out;
}
