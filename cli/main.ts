// import { parse } from "https://deno.land/std@0.200.0/flags/mod.ts";

import { parse, evaluate } from "../src/index.ts";

/**
  * Main function
  */
function main (argv: string[]) {
  let input: string = "";
  while (true) {
    input = prompt(">");

    if (input === 'q') break;
    try {
      const ast = parse(input);
      const result = evaluate(ast);
      console.log(result.length == 1? result[0] : result)
    } catch (e: Error) {
      console.error("ERR: " + e.message);
    }
  }
}

// Run the main function.
main(Deno.args);
