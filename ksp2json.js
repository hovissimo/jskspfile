// Take a big fat string of KSP's data file syntax, transform it (naively) to JSON
'use strict';

import ExtendableError from 'es6-error';

let rules = [
   [ /^\t*([^\s{}]+)\s*$/, handle_node_line ],
   [ /\t*([^\s{}]+) = (.*?)\s*$/, handle_value_pair_line ],
   [ /\t*{\s*$/, handle_open_brace ],
   [ /\t*}\s*$/, handle_close_brace ],
];

export default function ksp2json(input) {
   lines = input.split('\n')
   return lines.map(transform_line);
}

function transform_line(line) {
   let match;
   for (var [pattern, handler] of rules()) {
      match = pattern.exec(line);
      if (match) {
         let status = handler(match);
         if (status && status.done) { return; } // The handler has told us that we've finished constructing this node.
         break;
      }
   }
   if (!match) {
      // We finished looping through the rules without finding a match. Implies an error on this line.
      throw new UnrecognizedSyntaxError();
   }
}

class UnrecognizedSyntaxError extends ExtendableError { }
