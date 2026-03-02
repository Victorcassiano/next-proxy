#!/usr/bin/env bun

import { build } from "cli/build";
import { init } from "cli/init";

const command = process.argv[2];

switch (command) {
  case "init":
    await init();
    break;

  case "build":
    await build();
    break;

  default:
    console.log("Commands:");
    console.log("  init");
    console.log("  build");
}