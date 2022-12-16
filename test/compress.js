/* See README.md at the root of this distribution for copyright and
   license information */
/* eslint-env node, mocha */

import path from "path";
import { fileURLToPath } from 'url';
import { exec } from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { assert } from "chai";
import { promises as Fs } from "fs";
import { Dictionary } from "../src/Dictionary.js";
import tmp from "tmp";

/**
 * Unit tests for dictionary compressor
 */
describe("bin/compress", () => {

  function UNit() {}

  it("compresses", () => {
    const txtfile = `${__dirname}/data/dictionary.txt`;
    const cmd = `${__dirname}/../bin/compress.js`;

    return new Promise((resolve, reject) => {
      tmp.file((err, dictfile) => {
        const e = exec(`node ${cmd} ${txtfile} ${dictfile}`);
        e.stdout.on('data', console.log);
        e.stderr.on('data', console.error);
    
        e.on('exit', code => {
          assert.equal(code, 0);
          const words = [];
          Fs.readFile(txtfile)
          .then(data => data.toString().split(/\r?\n/)
                .map(w => w.replace(/\s.*$/, "")) // comments
                .filter(line => line.length > 0)
                .map(w => words.push(w)))
          .then(() => Fs.readFile(dictfile))
          .then(data => new Dictionary("test").loadDAWG(data.buffer))
          .then(dic => words.forEach(
            word => assert(dic.hasWord(word), `${word} missing`)))
          .then(resolve);
        });
      });
    });
  });
});
