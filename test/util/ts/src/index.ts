import _ from 'lodash';
import {argv} from "node:process";
import {dirname, join as pathJoin} from "node:path";
import {mkdir, writeFile, readFile} from "node:fs/promises";
import assert from "node:assert";
import {Config} from "./types.js";
import {CONFIG_FILE, OUTPUT_DIR} from "./constants.js";
const {join, split, forEach, zip, map} = _;

export async function writeSql(sqls: string[]): Promise<void> {
    const inputDir = argv[2];
    const depsFile = argv[3];
    const inputFiles = argv[4];
    const config: Config = JSON.parse(await readFile(pathJoin(inputDir, CONFIG_FILE), 'utf8'));
    const outputFiles = map(config.outputFiles, outputFile => pathJoin(inputDir, OUTPUT_DIR, outputFile));
    await mkdir(dirname(depsFile), {recursive: true});
    await writeFile(depsFile, `${join(outputFiles, ' ')}: ${join(split(inputFiles, '\n'), ' \\\n')}`);
    for (const [outputFile, sql] of zip(outputFiles, sqls)) {
        assert(outputFile);
        assert(sql);
        await mkdir(dirname(outputFile), {recursive: true});
        await writeFile(outputFile, sql);
    }
}
