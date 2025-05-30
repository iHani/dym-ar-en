import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      clean: true,
    }),
    terser(),
  ],
};