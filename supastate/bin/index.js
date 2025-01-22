#!/usr/bin/env node
import {program} from "../lib/cli/index.js";
await program.parseAsync(process.argv);
