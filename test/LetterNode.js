/*Copyright (C) 2019-2022 Crawford Currie http://c-dot.co.uk*/
/* eslint-env node, mocha */

import { LetterNode } from "../src/LetterNode.js";
import { assert } from "chai";

/**
 * Unit tests for LetterNode
 */
describe("LetterNode", () => {

  it("eachWord", () => {
    let root = new LetterNode("A");
    assert(root.add('MAUL'));
    assert(root.add('MEAT'));
    assert(root.add('EATS'));
    assert(root.add('ATE'));
    let s = [];
    root.eachWord("", w => s.push(w));
    assert.deepEqual(s, [ 'ATE', 'EATS', "MAUL", "MEAT" ]);
    root.add('ATE');
    s = [];
    root.eachWord("", w => s.push(w));
    assert.deepEqual(s, [ 'ATE', 'EATS', "MAUL", "MEAT" ]);
  });

  it("eachNode", () => {
    let root = new LetterNode("A");
    assert(root.add('AST'));
    assert(root.add('AAR'));
    let s = [];
    root.eachWord("", w => s.push(w));
    assert.deepEqual(s, [ 'AAR', 'AST' ]);

    // Check cb returning false stops eachNode
    s = "";
    root.eachNode(n => { s = n.letter; return false; });
    assert.equal(s, "A");

    // Scan until we reach the first "T". The scan is depth first,
    // so this should be the T in "AST"
    s = "";
    root.eachNode(n => {
      //console.log(n.letter);
      s += n.letter;
      return n.letter !== "T";
    });
    assert.equal(s, "AARST");
  });

  it("eachLongWord", () => {
    let root = new LetterNode("A");
    root.add('A');
    root.add('ANT');
    root.add('TAN');
    root.add('TA');
    root.add('RANT');
    root.add('AN');
    let s = [];
    root.eachLongWord("", w => s.push(w));
    assert.deepEqual(s, [ 'ANT', 'RANT', 'TAN' ]);
    s = [];
    root.eachWord("", w => s.push(w));
    assert.deepEqual(s, [ 'A', "AN", 'ANT', "RANT", "TA", "TAN" ]);
  });

  it("match", () => {
    let root = new LetterNode("A");
    root.add('A');
    root.add('ANT');
    root.add('TAN');
    root.add('TA');
    root.add('TEA');
    root.add('RANT');
    root.add('AN');
    const found = root.match("TA", 0);
    //console.debug(found);
    assert.equal(found.letter, "A");
    assert.equal(found.next.letter, "E");
    assert.equal(found.child.letter, "N");
  });

  it("buildLists", () => {
    let root = new LetterNode("A");
    root.add('TAN');
    root.add('TA');
    root.add('TEA');
    root.add('TAT');
    root.buildLists();
    const found = root.match("TA", 0);
    assert.equal(found.preNodes.length, 1);
    assert.equal(found.preNodes[0].letter, "T");
    assert.equal(found.postNodes.length, 2);
    assert.equal(found.postNodes[0].letter, "N");
    assert.equal(found.postNodes[1].letter, "T");
  });

  it("findWordsThatUse", () => {
    let root = new LetterNode("A");
    assert(root.add('MAUL'));
    assert(root.add('MEAT'));
    assert(root.add('EATS'));
    assert(root.add('ATE'));
    let found = {};
    root.findWordsThatUse(["A"], "", "", found);
    assert.deepEqual(found, {});
    root.findWordsThatUse(["A", "T"], "", "", found);
    assert.deepEqual(found, {});
    root.findWordsThatUse(["A", "T", "E"], "", "", found);
    assert.deepEqual(found, { "ATE": "ATE" });
    found = {};
    root.findWordsThatUse([" ", " ", " "], "", "", found);
    assert.deepEqual(found, { "ATE": "   "});
  });

  it("decode", () => {
    let numb = (66 << LetterNode.CHILD_INDEX_SHIFT)
        | LetterNode.END_OF_WORD_BIT_MASK;
    let node = new LetterNode("X");
    node.decode(99, numb);
    assert(node.isEndOfWord);
    assert.equal(node.letter, "X");
    assert.equal(node.next, 100);
    assert.equal(node.child, 66);

    node = new LetterNode("X");
    numb = (666 << LetterNode.CHILD_INDEX_SHIFT)
    | LetterNode.END_OF_LIST_BIT_MASK;
    node.decode(99, numb);
    assert.equal(node.child, 666);
    assert(!node.next, node.next);
  });
});
