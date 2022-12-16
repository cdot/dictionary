/*Copyright (C) 2019-2022 Crawford Currie http://c-dot.co.uk*/

/* eslint-env node */

/**
 * Command-line program to generate a DAWG (Directed Acyclic Word Graph) from a
 * word lexicon. Generates a somewhat optimised Trie, and encodes it in
 * an integer array.
 *
 * `node js/dawg/dictionary_compressor.js` will tell you how to use it.
 * @module
 */

import path from "path";
import fs from "fs";
import { Trie } from "../src/Trie.js";
const Fs = fs.promises;

/**
 * Generate a compressed dictionary from the text file of words.
 * @param {string} infile file of words, one per line, # for comments
 * @param {string} outfile file for dictionary
 * @return {Promise} a promise to create the dictionary
 */
function compress(infile, outfile, report) {
  //console.log("Compress",infile,"to",outfile);
  return Fs.readFile(infile, "utf8")
  .then(async function(data) {
    const lexicon = data
          .toUpperCase()
          .split(/\r?\n/)
          .map(w => w.replace(/\s.*$/, "")) // comments
          .filter(line => line.length > 0)
          .sort();

    // First step; generate a Trie from the words in the lexicon
    const trie = new Trie(lexicon, report);

    // Second step; generate a DAWG from the Trie
    trie.generateDAWG();

    // Generate an integer array for use with Dictionary
    const buffer = trie.encode();

    // Write DAWG binary bytes
    const dv = new DataView(buffer);
    return Fs.writeFile(outfile, dv)
    .then(() => report(`Wrote DAWG to ${outfile}`));
  })
  .catch(e => {
    report(e.toString());
  });
}

const DESCRIPTION = [
  "USAGE",
  `\tnode ${path.relative(".", process.argv[1])} <lexicon> <outfile>`,
  "\nDESCRIPTION",
  "\tCreate a directed acyclic word graph (DAWG) from a list of words.",
  "\t<lexicon> is a text file containing a list of words, and <outfile>",
  "\tis the binary file containing the compressed DAWG.",
  "\tThe lexicon is a simple list of case-insensitive words, one per line.",
  "\tAnything after a space character on a line is ignored."
].join("\n");

if (process.argv.length === 4) {
  const infile = process.argv[2];
  const outfile = process.argv[3];
  compress(infile, outfile, console.log);
} else {
  console.error(DESCRIPTION);
  process.exit(1);
}

