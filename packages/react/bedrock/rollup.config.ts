import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import strip from "@rollup/plugin-strip";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import { RollupOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { generateDts } from "../../../pipeline/utils/rollup/generateDts";
import { generateOutputConfig } from "../../../pipeline/utils/rollup/generateOutputConfig";
import { resolve } from "path";

const isProduction = process.env.NODE_ENV === "production";
const packageName = "@nlux/bedrock-react";
const outputFile = "bedrock-react";

const absolutePath = (path: string) => resolve("..", "..", "..", path);
const packageConfig: () => Promise<RollupOptions[]> = async () => [
  {
    input: "./src/index.ts",
    logLevel: "silent",
    treeshake: "smallest",
    strictDeprecations: true,
    plugins: [
      alias({
        entries: [
          {
            find: /^@shared\/(.*)/,
            replacement: `${absolutePath("packages/shared/src")}/$1.ts`,
          },
        ],
      }),
      commonjs(),
      esbuild(),
      isProduction &&
        strip({
          include: "**/*.(mjs|js|ts)",
          functions: ["debug", "console.log", "console.info"],
        }),
      replace({
        values: {
          "process.env.NLUX_DEBUG_ENABLED": JSON.stringify(
            isProduction ? "false" : "true"
          ),
        },
        preventAssignment: true,
      }),
      isProduction && terser(),
    ],
    external: ["@nlux/react", "react"],
    output: generateOutputConfig(packageName, outputFile, isProduction),
  },
  generateDts(outputFile, isProduction),
];

export default packageConfig;
