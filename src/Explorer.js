/*Copyright (C) 2019-2022 Crawford Currie http://c-dot.co.uk*/

import { Dictionary } from "./Dictionary.js";

/**
 * Different ways to explore a dictionary
 */
class Explorer {

  /**
   * Determine if the words passed are valid sub-sequences of any
   * word in the dictionary e.g. 'UZZL' is a valid sub-sequence in
   * an English dictionary as it is found in 'PUZZLE', but 'UZZZL'
   * isn't.
   * @param {Dictionary} dictionary dawg to explore
   * @param {string[]?} words list of words to check
   * @param {function} report reporter function(word). This function
   * will be called each time a matching word is found, passing the word
   * as a string.
   */
  static sequences(dictionary, words, report) {
    if (!(dictionary instanceof Dictionary))
      throw Error("Not a Dictionary");
    const valid = [];
    //report(`Valid sequences:`);
    for (let w of words) {
      if (dictionary.hasSequence(w))
        report(w);
    }
  }

  /**
   * Find anagrams of the words that use all the letters. `.`
   * works as a character wildcard.
   * @param {Dictionary} dictionary dawg to explore
   * @param {string[]?} words list of words to check
   * @param {function} report reporter function(word). This function
   * will be called each time a matching word is found, passing the word
   * as a string.
   */
  static anagrams(dictionary, words, report) {
    if (!words || words.length === 0)
      throw Error("Need letters to find anagrams of");

    for (const w of words) {
      let anag = Object.keys(dictionary.findAnagrams(w.replace(/\./g, " ")));
      anag = anag.filter(word => word.length === w.length);
      //report(`${anag.length} words found in "${w}":`);
      anag.forEach(w => report(w));
    }
  }

  /**
   * Find words that hangman match all the letters. `.`
   * works as a character wildcard.
   * @param {Dictionary} dictionary dawg to explore
   * @param {string[]?} words list of words to check
   * @param {function} report reporter function(word). This function
   * will be called each time a matching word is found, passing the word
   * as a string.
   */
  static hangmen(dictionary, words, report) {
    if (!words || words.length === 0)
      throw Error("Need letters to find hangman matches for");

    for (const w of words) {
      const matches =
            dictionary.findHangmen(w.replace(/\./g, " "));
      matches.forEach(w => report(w));
    }
  }

  /**
   * Find arrangements of the letters in the words e.g. `UIE` is a
   * an arrangement of the letters in `QUIET`, as is `EIU` and `IUE`.
   * @param {Dictionary} dictionary dawg to explore
   * @param {string[]?} words list of words to check
   * @param {function} report reporter function(word). This function
   * will be called each time a matching word is found, passing the word
   * as a string.
   */
  static arrangements(dictionary, words, report) {
    if (!words || words.length === 0)
      throw Error("Need letters to find arrangements of");

    for (const w of words) {
      let anag = Object.keys(dictionary.findAnagrams(w));
      //report(`${anag.length} words found in "${w}":`);
      anag.forEach(w => report(w));
    }
  }

  /**
   * List all the words in the dictionary. If `words` is given,
   * list all dictionary entries that start with one of the words.
   * @param {Dictionary} dictionary dawg to explore
   * @param {string[]?} words list of words to check
   * @param {function} report reporter function(word). This function
   * will be called once for each word in the dictionary.
   * as a string.
   */
  static list(dictionary, words, report) {
    if (!words || words.length === 0) {
      dictionary.eachWord((s, n) => report(s));
      return;
    }

    // Dump of words that match words
    const biglist = {};
    words.map(w => {
      const word = w.toUpperCase();
      const node = dictionary.match(word);
      if (node)
        return { word: word, node: node };
      return undefined;
    })
    .filter(r => r)
    .sort((a, b) => {
      return a.word.length > b.word.length ? -1 :
      a.word.length === b.word.length ? 0 : 1;
    })
    .map(root => {
      if (root.node.child) {
        let list = [];
        biglist[root.word] = true;
        root.node.child.eachWord(root.word, w => list.push(w));

        list = list.filter(w => !biglist[w]);
        list.forEach(w => {
          biglist[w] = true;
          report(w);
        });
      }
    });
  }
}

export { Explorer };
