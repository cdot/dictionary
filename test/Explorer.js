/* See README.md at the root of this distribution for copyright and
   license information */

import { Dictionary } from "../src/Dictionary.js";
import { Explorer } from "../src/Explorer.js";
import { assert } from "chai";

describe("Explorer", () => {

  const WORDS = [
    "ATOMIC", "INFINITESIMAL", "MICROSCOPIC", "MINIATURE",
    "MINUSCULE", "MINUTE", "TEENSY", "TEENY", "WEE", "WEENSY", "BABY",
    "DIMINUTIVE", "DWARF", "ELFIN", "LITTLE", "PETITE", "POCKET",
    "PYGMY", "SMALL", "DINKY", "DWARFISH", "INSIGNIFICANT", "PUNY",
    "UNDERSIZED", "BIG", "BULKY", "BUMPER", "CONSIDERABLE",
    "EXTENSIVE", "EWE", "GOOD", "GOODLY", "GRAND", "GREAT", "GROSS",
    "HANDSOME", "HANGMAN", "HANGMEN", "HEFTY", "HULKING", "JUMBO",
    "LARGE", "LARGISH",
    "MAJOR", "OUTSIZED", "OVERGROWN", "OVERSCALE", "OVERSIZED",
    "SIZEABLE", "SUBSTANTIAL", "SUPER", "WHACKING", "WHOPPING",
    "FORMIDABLE", "GRANDIOSE", "IMPOSING", "LOFTY", "MAJESTIC",
    "MONOLITHIC", "STAGGERING", "STUPENDOUS", "TOWERING", "BOUNDLESS",
    "CAVERNOUS", "IMMEASURABLE", "INFINITE", "VAST", "VOLUMINOUS",
    "ASTRONOMICAL", "COLOSSAL", "COSMIC", "ELEPHANTINE", "ENORMOUS",
    "GIANT", "GIGANTIC", "HERCULEAN", "HEROIC", "HUGE", "IMMENSE",
    "WEED", "MAMMOTH", "MASSIVE", "MONSTER", "MONSTROUS",
    "MONUMENTAL", "MOUNTAINOUS", "PLANETARY", "PRODIGIOUS", "TITANIC",
    "TREMENDOUS"
  ].sort();

  function loadict() {
    const dictionary = new Dictionary("test");
    WORDS.forEach(w => dictionary.addWord(w));
    return dictionary;
  }

  function UNit() {}
  
  it("list all", () => {
    const dictionary = loadict();
    const ws = [];
    Explorer.list(dictionary, [], w => ws.push(w));
    assert.deepEqual(ws.sort(), WORDS);
  });

  it("list some", () => {
    const dictionary = loadict();
    const ws = [];
    Explorer.list(dictionary, ["WEE"], w => ws.push(w));
    assert.equal("WEE -- WEED\nWEE -- WEENSY", ws.join(""));
  });

  it("anagrams", () => {
    const dictionary = loadict();
    const ws = [];
    Explorer.anagrams(dictionary, ["WEE"], w => ws.push(w));
    assert.deepEqual(["2 words found in \"WEE\":",
                      "EWE", "WEE"], ws);
  });

  it("sequences", () => {
    const dictionary = loadict();
    const ws = [];
    Explorer.sequences(dictionary, ["WEE", "CUTE"], w => ws.push(w));
    assert.deepEqual(["Valid sequences:", "WEE"], ws);
  });

  it("arrangements", () => {
    const dictionary = loadict();
    const ws = [];
    Explorer.arrangements(dictionary, ["WEENSY"], w => ws.push(w));
    assert.deepEqual(["3 words found in \"WEENSY\":",
                      "EWE", "WEE", "WEENSY"], ws);
  });

  it("hangmen", () => {
    const ws = [];
    const dictionary = loadict();
    Explorer.hangmen(dictionary, ["H.NG..N"], w => ws.push(w));

    assert.deepEqual(["HANGMAN", "HANGMEN"], ws);
  });
});
