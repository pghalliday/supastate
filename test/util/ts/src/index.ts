import _ from 'lodash';
import {argv} from "node:process";
import {dirname, join as pathJoin} from "node:path";
import {mkdir, writeFile, readFile} from "node:fs/promises";
import assert from "node:assert";
const {join, split, forEach, zip, map} = _;

export async function writeSql(sqls: string[]): Promise<void> {
    const inputDir = argv[2];
    const depsFile = argv[3];
    const inputFiles = argv[4];
    let outputFiles: string[] = JSON.parse(await readFile(pathJoin(inputDir, '../dependencies.json'), 'utf8'));
    outputFiles = map(outputFiles, outputFile => pathJoin(inputDir, `../${outputFile}`));
    await mkdir(dirname(depsFile), {recursive: true});
    await writeFile(depsFile, `${join(outputFiles, ' ')}: ${join(split(inputFiles, '\n'), ' \\\n')}`);
    for (const [outputFile, sql] of zip(outputFiles, sqls)) {
        assert(outputFile);
        assert(sql);
        await mkdir(dirname(outputFile), {recursive: true});
        await writeFile(outputFile, sql);
    }
}
