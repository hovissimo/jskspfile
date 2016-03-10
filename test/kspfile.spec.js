import {assert, expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import {
   yield_lines,
   KSPNode,
   UnrecognizedSyntaxError,
   UnclosedNodeError,
   strip_comments,
} from '../kspfile';

describe('yield_lines', () => {
   it('should return an iterator', () => {
      const lines = yield_lines('here\'s a file\nwoooo');
      expect(lines.next).to.be.a('function');
   });
   it('should yield separate lines from the passed string', () => {
      const lines = yield_lines('stuff\n and things\n.');
      expect(lines.next().value).to.be.equal('stuff');
      expect(lines.next().value).to.be.equal(' and things');
      expect(lines.next().value).to.be.equal('.');
      expect(lines.next().done).to.be.true;
   });
});

describe('KSPNode', () => {
   describe('constructor', () => {
      it('should throw if a line is unmatched', () => {
         const lines = ['asdf bsdf csdf'];
         expect(() => {
            new KSPNode('', lines)
         }).to.throw(UnrecognizedSyntaxError);
      });

      it('should call handle_node_line for node names', () => {
         const lines = ['GAME', '{', '}'];
         sinon.spy(KSPNode.prototype, 'handle_node_line');
         const node = new KSPNode(undefined, lines);
         expect(node.handle_node_line.callCount).to.be.equal(1);
      });

      it('should call handle_value_pair_line for data fields', () => {
         const lines = ['foo = bar, baz', '{', '}'];
         sinon.spy(KSPNode.prototype, 'handle_value_pair_line');
         const node = new KSPNode(undefined, lines);
         expect(node.handle_node_line.callCount).to.be.equal(1);
      });

      it('should throw an error when missing the closing brace', () => {
         const lines = ['GAME', 'foo = bar, baz'];
         expect(() => {
            new KSPNode('', lines)
         }).to.throw(UnclosedNodeError);
      });

      it('should call handle_close_brace for close braces', () => {
         const lines = ['}'];
         sinon.spy(KSPNode.prototype, 'handle_close_brace');
         const node = new KSPNode(undefined, lines);
         expect(node.handle_close_brace.callCount).to.be.equal(1);
      });

      it('should not throw for an empty line', () => {
         const lines = ['', '}']; // we need the close brace for now, TODO
         expect( () => new KSPNode(undefined, lines) )
            .to.not.throw(Error);
      }); 
   });
});
