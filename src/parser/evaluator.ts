import { Expr } from "./parser.ts";
import { EvaluationError, ParseError } from "../errors.ts";

const OPS: {
  [key: string]: (a: number, b: number) => number
} = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b
}

export function evaluate(expr: Expr): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (typeof expr === 'string') {
    throw new EvaluationError("Variables not yet implemented");
  }

  const [op, ...args] = expr;

  if (!OPS[op])
    throw new EvaluationError(op + " is not a valid operator");

  return args.map(evaluate).reduce(OPS[op]);
}
