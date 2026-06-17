#!/usr/bin/env bun

import { build } from "./src/cli/build.js";
import { init } from "./src/cli/init.js";
import { validate } from "./src/cli/validate.js";

const command = process.argv[2];
const args = process.argv.slice(3);
const force = args.includes("--force");

switch (command) {
  case "init":
    await init();
    break;

  case "build":
    await build({ force });
    break;

  case "validate":
    await validate();
    break;

  default:
    console.log("Commands:");
    console.log("  init");
    console.log("  build [--force]");
    console.log("  validate");
}
