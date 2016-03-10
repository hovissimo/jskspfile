import {assert, expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import {KSPDeserializer, yield_lines, KSPNode, UnrecognizedSyntaxError, UnclosedNodeError} from '../kspfile';

describe('KSPDeserializer', () => {
   describe('hello()', () => {
      it('should return world', () => {
         let kspd = new KSPDeserializer();
         expect(kspd.hello()).to.be.equal('World');
      });
   });
});

describe('yield_lines', () => {
   it('should return an iterator', () => {
      let lines = yield_lines('here\'s a file\nwoooo');
      expect(lines.next).to.be.a('function');
   });
   it('should yield separate lines from the passed string', () => {
      let lines = yield_lines('stuff\n and things\n.');
      expect(lines.next().value).to.be.equal('stuff');
      expect(lines.next().value).to.be.equal(' and things');
      expect(lines.next().value).to.be.equal('.');
      expect(lines.next().done).to.be.true;
   });
});

xdescribe('read', () => {
   it('should return a value-pair', () => {
      let lines = ['foo = bar', 'baz = qux, quuux, 345'];
      var out = read(lines)
   });
});

describe('KSPNode', () => {
   describe('constructor', () => {
      it('should throw if a line is unmatched', () => {
         const line = 'asdf bsdf csdf';
         let test_fn = () => {new KSPNode('', [line])};
         expect(test_fn).to.throw(UnrecognizedSyntaxError);
      });

      it('should call handle_node_line for node names', () => {
         const lines = ['GAME', '{', '}'];
         sinon.spy(KSPNode.prototype, 'handle_node_line');
         let node = new KSPNode(undefined, lines);
         expect(node.handle_node_line.callCount).to.be.equal(1);
      });

      it('should call handle_value_pair_line for data fields', () => {
         const lines = ['foo = bar, baz', '{', '}'];
         sinon.spy(KSPNode.prototype, 'handle_value_pair_line');
         let node = new KSPNode(undefined, lines);
         expect(node.handle_node_line.callCount).to.be.equal(1);
      });

      it('should throw an error when missing the closing brace', () => {
         const lines = ['GAME', 'foo = bar, baz'];
         let test_fn = () => {new KSPNode('', lines)};
         expect(test_fn).to.throw(UnclosedNodeError);
      });

      it('should call handle_close_brace for close braces', () => {
         const lines = ['}'];
         sinon.spy(KSPNode.prototype, 'handle_close_brace');
         let node = new KSPNode(undefined, lines);
         expect(node.handle_close_brace.callCount).to.be.equal(1);
      });
      it('should call noop for an empty line'); 
   });
});
