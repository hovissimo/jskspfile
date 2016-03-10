import ExtendableError from 'es6-error';

export class KSPDeserializer {
   hello() {
      return "World";
   }
}

export function *yield_lines(string) {
   yield* string.split('\n');
}

function read(lines) {
}

export class KSPNode {
   constructor(name, lines) {
      // This recursive constructor eats lines from a generator
      this.name = name;
      for (var line of lines) {
         let match;
         for (var [pattern, handler] of this.rules()) {
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
      return [
         [ /^\t*([^\s{}]+)\s*$/, this.handle_node_line ],
         [ /\t*([^\s{}]+) = (.*?)\s*$/, this.handle_value_pair_line ],
         [ /\t*{\s*$/, () => {} ], // no op
         [ /\t*}\s*$/, this.handle_close_brace ],
      ];
   }
}

export class UnrecognizedSyntaxError extends ExtendableError { }
export class UnclosedNodeError extends ExtendableError { }
