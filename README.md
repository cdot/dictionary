# dictionary
Javascript support for high performance word dictionaries using [directed acyclic word graphs](https://en.wikipedia.org/wiki/Deterministic_acyclic_finite_state_automaton).

Supports:
* looking up words,
* finding anagrams, with optional wildcards,
* hangman matching (words with letters in known positions)
* determining if a particular sequence of letters occurs in any word
  in the dictionary.
* node.js and browsers

For an illustration of how it can be used, run
```
$ node node_modules/@cdot/dictionary/bin/explore.js
```

The code is loosely based on [Daniel Weck's DAWG_Compressor program](https://github.com/danielweck/scrabble-html-ui) but has many tweaks and improvements.

## Creating a dictionary
Dictionaries are created from word lists. These are UTF-8 encoded files of
words, one per line. Case is not important, nor is the sort order, but
any line that starts with a space will be ignored.

To build a new dictionary, follow the instructions given when you run:
```
$ node node_modules/@cdot/dictionary/bin/compress.js
```

## API
See [here](https://cdot.github.io/dictionary) for the full API.
