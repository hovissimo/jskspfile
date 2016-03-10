import ExtendableError from 'es6-error';

export class KSPNode {
   constructor(name, lines) {
      // This recursive constructor eats lines from a generator
      this.name = name;
      for (const line of lines) {
         let match;
         for (const [pattern, handler] of this.rules()) {
            match = pattern.exec(line);
            if (match) {
               const status = handler(match);
               if (status && status.done) { return; } // The handler has told us that we've finished constructing this node.
               break;
            }
         }
         if (!match) {
            // We finished looping through the rules without finding a match. Implies an error on this line.
            throw new UnrecognizedSyntaxError();
         }
      }
      //  else: This constructor should return before we get to the end of the loop.
      throw new UnclosedNodeError("Abnormally reached end of file while waiting for a closing brace.");
   }

   handle_node_line() { } 
   handle_value_pair_line() { } 

   handle_close_brace() {
      return {done:true};
   }

   add_node(node) {
      //add the passed node to this node as a child
   }

   add_value_pair(name, value) {
      // add a value-pair to this node
   }

   rules() {
      const node_name_pattern = /^\t*([^\s{}]+)\s*$/;
      const value_pair_pattern = /^\t*([^\s{}]+) = (.*?)\s*$/;
      const open_brace_pattern = /^\t*{\s*$/;
      const close_brace_pattern = /^\t*}\s*$/;
      const empty_line_pattern = /^\s*$/;
      return [
         [ node_name_pattern, this.handle_node_line ],
         [ value_pair_pattern, this.handle_value_pair_line ],
         [ open_brace_pattern, () => {} ], // open brace, no op
         [ close_brace_pattern, this.handle_close_brace ],
         [ empty_line_pattern, () => {} ], // empty line, no op
      ];
   }
}

export function strip_comments(line) {
   return line.replace(/(.*?)\s*\/\/.*$/, '$1');
}

export function *yield_lines(string) {
   yield* string.split('\n');
}

export class UnrecognizedSyntaxError extends ExtendableError { }
export class UnclosedNodeError extends ExtendableError { }
