import "core-js";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import { version } from "./package.json";

const banner = `/**
 * @license 
 * Ideal Postcodes <https://ideal-postcodes.co.uk>
 * BigCommerce Plugin ${version}
 * Copyright IDDQD Limited, all rights reserved
 */`;

// Configure terser to ignore build info banner
const terserConfig = {
  output: {
    comments: (_, { value, type }) => {
      if (type === "comment2") return /@license/i.test(value);
    },
  },
};

export default [
  {
    input: "lib/index.ts",
    output: {
      file: "./dist/bigcommerce.min.js",
      banner,
      format: "umd",
      name: "IdealPostcodes",
      exports: "named",
    },
    plugins: [
      typescript({ tsconfig: false, lib: ["dom"], target: "ESNext" }),
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        ignore: [/core-js/],
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                ie: "11",
              },
              modules: false,
              spec: true,
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
        ],
      }),
      terser(terserConfig),
    ],
  },
  /**
   * ESM build that targets latest browsers (no transpilation step)
   */
];
