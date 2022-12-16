/*Copyright (C) 2019-2022 Crawford Currie http://c-dot.co.uk*/
/* eslint-env node, mocha */

import path from "path";
import { fileURLToPath } from 'url';
import { Dictionary } from "../src/Dictionary.js";
import fs from "fs";
import { assert } from "chai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Fs = fs.promises;

/**
 * Unit tests for Dictionary (and inherently, for LetterNode)
 */
describe("Dictionary", () => {

  function UNit() {}

  it("loads words", () => {
    let dic = new Dictionary("test");
    assert(dic.addWord('A'));
    assert(dic.addWord('ANT'));
    assert(dic.addWord('TAN'));
    assert(!dic.addWord('ANT'));
    let s = [];
    dic.eachWord(w => s.push(w));
    assert.deepEqual(s, [ 'A', 'ANT', 'TAN' ]);
    dic.addWord('ANT');
    s = [];
    dic.eachWord(w => s.push(w));
    assert.deepEqual(s, [ 'A', 'ANT', 'TAN' ]);
    assert(dic.hasWord('ANT'));
    assert(!dic.hasWord('TNA'));
    dic.addWord('TA');
    dic.addWord('RANT');
    const anags = dic.findAnagrams("nat ");
    assert.deepEqual(anags, {
      A: 'A',
      ANT: 'ANT',
      TA: 'TA',
      TAN: 'TAN',
      RANT: " ANT"
    });
  });

  it("loads a dictionary", () => {
    return Fs.readFile(`${__dirname}/data/dictionary.dict`)
    .then(data => new Dictionary("test").loadDAWG(data.buffer))
    .then(dic => {
      assert(dic.hasWord('LAZY'));
      assert(!dic.match("AXE"));
      assert.equal(dic.match("LAZY").letter, 'Y');
    });
  });

  // Load and extend a dictionary with new words
  it("extends a dictionary", () => {
    return Fs.readFile(`${__dirname}/data/dictionary.dict`)
    .then(data => new Dictionary("test").loadDAWG(data.buffer))
    .then(dic => {
      assert(dic.hasWord("QUICK"));
      assert(!dic.hasWord("AARDVAARK"));
      assert(!dic.hasSequence("VAAR"));

      dic.addWord("AARDVAARK");
      assert(dic.hasSequence("VAAR"));

      dic.addWord("BISON");
      dic.addWord("BISONIC");

      assert(dic.hasWord("BISON"));
      assert(dic.hasWord("BISONIC"));

      assert(dic.hasSequence("VAAR"));
    });
  });

  it("builds links", () => {
    let dic = new Dictionary("test");
    dic.addWord('A');
    dic.addWord('ANT');
    dic.addWord('TAN');

    dic.addLinks();

    const s = dic.getSequenceRoots('N');
    assert(s.length === 2);
    assert.equal(s[0].preNodes[0].letter, 'A');
    assert.deepEqual(s[0].preLetters, ['A']);
    assert.equal(s[0].postNodes[0].letter, 'T');
    assert.deepEqual(s[0].postLetters, ['T']);

    assert.equal(s[1].preNodes[0].letter, 'A');
    assert.deepEqual(s[1].preLetters, ['A']);
    assert.equal(s[1].postNodes.length, 0);
    assert.deepEqual(s[1].postLetters.length, 0);
  });

  it("hangmen", () => {
    return Fs.readFile(`${__dirname}/data/dictionary.dict`)
    .then(data => new Dictionary("test").loadDAWG(data.buffer))
    .then(dic => {
      assert.deepEqual(
        dic.findHangmen("H NGM N"),
        [ 'HANGMAN', 'HANGMEN', 'HUNGMAN', 'HUNGMEN' ] );
      assert.deepEqual(
        dic.findHangmen("H NGMEN"),
        [ 'HANGMEN', 'HUNGMEN' ]
      );
      assert.deepEqual(
        dic.findHangmen("H NGMENS"),
        []);
    });
  });
});
