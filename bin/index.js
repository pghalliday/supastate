#!/usr/bin/env node
import {program} from "../lib/src/cli/index.js";
await program.parseAsync(process.argv);
