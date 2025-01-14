import {Command} from 'commander';
import _ from 'lodash';
import {mkdir, writeFile, readFile} from "node:fs/promises";
import {resolve, dirname, join} from "node:path";
import {Config} from "../types.js";
import {DEPENDENCIES_FILE, OUTPUT_DIR} from "../constants.js";
const __dirname = import.meta.dirname;
const {map} = _;

const packageJson = await readFile(resolve(__dirname, '../../package.json'), 'utf8');
const packageConf = JSON.parse(packageJson);

export const program = new Command()
    .name(packageConf.name)
    .description(packageConf.description)
    .version(packageConf.version);

interface Options {
    outputFile: string;
    inputFiles: string[];
}

program
    .command('createSQLDependencies')
    .description('Generate a makefile include file to define the rules to generate the supastate SQL files')
    .requiredOption('-o --outputFile <string>', 'Output file')
    .requiredOption('-i --inputFiles <string...>', 'Input files')
    .action(async (options: Options) => {
        console.log(`Creating SQL dependencies include file: ${options.outputFile}`);
        let rules = '';
        for (const inputFile of options.inputFiles) {
            let dependencies: string[] = JSON.parse(await readFile(
                inputFile.replace(/\/main\.sql$/, `/${DEPENDENCIES_FILE}`),
                'utf8'
            ));
            const inputDir = dirname(inputFile);
            dependencies = map(dependencies, dependency => join(inputDir, dependency));
            rules += `${inputFile}: ${dependencies.join(' ')}\n`;
        }
        await mkdir(dirname(options.outputFile), {recursive: true});
        await writeFile(options.outputFile, rules);
    });

program
    .command('createSQLRules')
    .description('Generate a makefile include file to define the rules to generate the supastate SQL files')
    .requiredOption('-o --outputFile <string>', 'Output file')
    .requiredOption('-i --inputFiles <string...>', 'Input files')
    .action(async (options: Options) => {
        console.log(`Creating SQL rules include file: ${options.outputFile}`);
        let rules = '';
        for (const inputFile of options.inputFiles) {
            const inputDir = dirname(inputFile);
            let config: Config = JSON.parse(await readFile(inputFile, 'utf8'));
            const outputFiles = map(config.outputFiles, outputFile => join(inputDir, OUTPUT_DIR, outputFile));
            rules += `${outputFiles.join(' ')} &: $(SUPASTATE_TS_DEPENDENCY_DIR)/${inputDir}.d\n`;
            rules += `\t$(TOOLS_DIR)/scripts/supastate_build.sh ${inputDir} $<\n`;
        }
        await mkdir(dirname(options.outputFile), {recursive: true});
        await writeFile(options.outputFile, rules);
    });
