import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  mode: "production",
  entry: `${__dirname}/../src/index.js`,
  output: {
    filename: 'index.js',
    path: `${__dirname}/../dist/cjs`,
    globalObject: "this",
    library: {
      name: "dictionary",
      type: "umd"
    }
  },
  resolve: {
    extensions: [ '.js' ]
  }
};

export default config;
