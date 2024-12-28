import { parseArgs } from "@std/cli/parse-args";
import { parse, evaluate } from "../src/index.ts";
import { ParseError, EvaluationError } from "../src/errors.ts";

/**
  * Main function
  */
function main (argv: string[]) {
  // Handle arguments
  const args = parseArgs(argv, {
    alias: {
      "v": "version"
    },
    boolean: ["version"]
  });

  // Print version if requested
  if (args.version) {
    console.log("Etrix v.0.0.0");
    Deno.exit();
  }

  let input: string;
  // Main read-evaluate-print loop
  while (true) {
    input = prompt(">") ?? 'q';

    if (input === 'q') break;
    if (input === '') continue;

    try {
      console.log(evaluate(parse(input)));
    } catch (e) {
      if (e instanceof ParseError || e instanceof EvaluationError) {
        console.error("ERR: " + e.message);
      } else {
        console.error(e);
      }
    }
  }
}

// Run the main function.
main(Deno.args);
