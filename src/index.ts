const OPS = {
  '+': (a: number, b: number): number => a + b,
  '-': (a: number, b: number): number => b - a,
  '*': (a: number, b: number): number => a * b,
  '/': (a: number, b: number): number => b / a
}

////

export function parse (input: string): string[] {
  return input.split(' ');
}

export function evaluate (tokens: string[]): number[] {
  const stack: number[] = [];
  // Evaluate all
  for (const [i, token] of tokens.entries()) {
    if (token in OPS) {
      if (stack.length >= 2) {
        // Pop two numbers off the stack,
        // apply corresponding operation
        // push result to stack
        stack.push(OPS[token](stack.pop(), stack.pop()))
      } else {
        throw new Error("Not enough arguments for operation " + token +
        " at token " + i)
      }
    } else {
      const num = parseFloat(token);
      if (isNaN(num)) {
        throw new Error(token + " at " + i + " is neither a valid OP nor a valid number");
      }
      stack.push(num);
    }
  }
  return stack;
}
