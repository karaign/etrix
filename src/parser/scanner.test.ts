import { assertEquals } from "@std/assert";
import { Scanner } from "./scanner.ts";

function flush(sc: Scanner) {
  const res: string[] = [];
  while (sc.getPeek()) {
    res.push(sc.nextToken()!.stringRepr);
  }
  return res;
}

Deno.test("Correctly tokenize valid expressions", function validExprs() {
  const tokenizations = {
    "2+2": ['2', '+', '2'],
    "74 + 111 * (54 + 11)": ['74', '+', '111', '*', '(', '54', '+', '11', ')'],
    "    54 *(140+12) ": ['54', '*', '(', '140', '+', '12', ')'],
    " /*this is a comment*/ 1 +/*69 * 420 */ 2 *2 # ignore this": ['1', '+', '2', '*', '2'],
    "x + 2 * (xy + z * 450)": ['x', '+', '2', '*', '(', 'xy', '+', 'z', '*', '450', ')']
  }
  for (const [input, tokenization] of Object.entries(tokenizations)) {
    assertEquals(flush(new Scanner(input)), tokenization);
  }
})
