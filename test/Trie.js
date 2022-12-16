/*Copyright (C) 2019-2022 Crawford Currie http://c-dot.co.uk*/
/* eslint-env mocha */

import { Trie } from "../src/Trie.js";
import { Dictionary } from "../src/Dictionary.js";
import { assert } from "chai";

describe("dawg/Trie", () => {

  function UNit() {}

  it("tries", () => {
    const lexicon = [
      "A",
      "AB",
      "ABC",
      "BAB",
      "BB",
      "BBC",
      "XAB",
      "XABC"
    ];
    // Generate a Trie from the lexicon
    const trie = new Trie(lexicon);//, console.debug);
    assert.equal(trie.numberOfWords, lexicon.length);
    assert.equal(trie.numberOfNodes, 12);
    assert(!trie.first.next);

    const A = trie.first.child; assert.equal(A.letter, "A");
    const B = trie.first.child.next; assert.equal(B.letter, "B");
    const X = B.next; assert.equal(X.letter, "X");

    assert(A.sameSubtrie(A));
    
    const AB = A.child;
    const BA = B.child;
    const BB = BA.next;
    assert(AB.sameSubtrie(BB));

    const XA = X.child;
    assert(!XA.sameSubtrie(BA));

    trie.addWord("ABZ");
    assert(!AB.sameSubtrie(BB));

    trie.addWord("ABA");
  });

  it("subtries", () => {
    const lexicon = [
      "AABC",
      "BABD",
      "CAA",
      "CAB",
      "CBA",
      "CBC",
    ];
    const trie = new Trie(lexicon);//, console.debug);

    const A = trie.first.child;
    const B = A.next;
    
    assert(!A.child.sameSubtrie(B.child));

    const C = B.next;
    assert(!C.child.child.sameSubtrie(C.child.next.child));
    
  });

  it("optimises", () => {
    const lexicon = [
      "A",
      "AB",
      "ABC",
      "BAB",
      "BB",
      "BBC",
      "XAB",
      "XABC",
      "TIT",
      "TITS",
      "TOR",
      "WIT",
      "WITS",
      "NIT",
      "NITS",
      "NOR"
    ];
    // Generate a Trie from the lexicon
    const trie = new Trie(lexicon);//, console.debug);
    assert.equal(trie.numberOfWords, lexicon.length);
    assert.equal(trie.numberOfNodes, 28);

    let words = [];
    trie.eachWord(nodes => {
      words.push(nodes.map(n => n.letter).filter(l => l !== -1).join(""));
    });
    assert.deepEqual(words, lexicon.sort());

    const e = trie.encode();
    const before = new Dictionary("before").loadDAWG(e);
    const beforeWords = [];
    before.eachWord(word => beforeWords.push(word));
    assert.deepEqual(beforeWords, lexicon.sort());

    trie.generateDAWG();

    words = [];
    trie.eachWord(nodes => {
      words.push(nodes.map(n => n.letter).filter(l => l !== -1).join(""));
    });
    assert.deepEqual(words, lexicon.sort());
    assert.equal(trie.numberOfWords, lexicon.length);
    //console.log(trie.first.toString(true));
    assert.equal(trie.numberOfNodes, 18);

    const after = new Dictionary("after").loadDAWG(trie.encode());
    const afterWords = [];
    after.eachWord(word => afterWords.push(word));
    assert.deepEqual(afterWords, lexicon.sort());
  });
});
