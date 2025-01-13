import _ from 'lodash';
import {argv} from "node:process";
import {resolve, dirname} from "node:path";
import {mkdir, writeFile} from "node:fs/promises";
const {mapKeys, join, split, forIn} = _;

export async function writeSql(sqls: Record<string, string>): Promise<void> {
    const inputDir = argv[2];
    const depsFile = argv[3];
    const inputFiles = argv[4];
    sqls = mapKeys(sqls, (_, sqlFile) => resolve(inputDir, sqlFile));
    const sqlFiles = Object.keys(sqls);
    await writeFile(depsFile, `${join(sqlFiles, ' ')}: ${join(split(inputFiles, '\n'), ' \\\n')}`);
    forIn(sqls, async (sql, sqlFile) => {
        await mkdir(dirname(sqlFile), {recursive: true});
        await writeFile(sqlFile, sql);
    })
}
