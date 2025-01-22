import {Command} from 'commander';
import _ from 'lodash';
import {mkdir, writeFile, readFile} from "node:fs/promises";
import {resolve, dirname, join} from "node:path";
import {Config} from "../types.js";
const __dirname = import.meta.dirname;
const {transform} = _;

const packageJson = await readFile(resolve(__dirname, '../../package.json'), 'utf8');
const packageConf = JSON.parse(packageJson);

export const program = new Command()
    .name(packageConf.name)
    .description(packageConf.description)
    .version(packageConf.version);

interface Options {
    jsRulesFile: string;
    sqlRulesFile: string;
    reportRulesFile: string;
    sqlDirectory: string;
    configFiles: string[];
}

program
    .command('createMakefileRules')
    .description('Generate a makefile include file to define the rules to generate the supastate SQL files')
    .requiredOption('-j --jsRulesFile <string>', 'Output JS rules file')
    .requiredOption('-s --sqlRulesFile <string>', 'Output SQL rules file')
    .requiredOption('-r --reportRulesFile <string>', 'Output test report rules file')
    .requiredOption('-o --sqlDirectory <string>', 'SQL output directory')
    .requiredOption('-c --configFiles <string...>', 'Input Supatest config files')
    .action(async (options: Options) => {
        let jsRules = '';
        let sqlRules = '';
        const sqlFiles = [];
        for (const configFile of options.configFiles) {
            const inputDir = dirname(configFile);
            let config: Config = JSON.parse(await readFile(configFile, 'utf8'));
            let sqlMap: Record<string, string> = {};
            sqlMap = transform(
                config,
                (result, value, key) => result[join(
                    options.sqlDirectory,
                    inputDir,
                    key
                ) + '.sql'] = join(inputDir, value),
                sqlMap
            );
            sqlFiles.push(...Object.keys(sqlMap));
            const jsFiles = Object.values(sqlMap).join(' ');
            jsRules += `${jsFiles} &: $(SUPATEST_DEPENDENCY_DIR)/${inputDir}.d | $(SUPATEST_DEPENDENCY_DIRS)\n`;
            jsRules += `\t$(TOOLS_DIR)/scripts/supatest_build.sh "${inputDir}" $< "${jsFiles}"\n`;
            for (const sqlFile in sqlMap) {
                const jsFile = sqlMap[sqlFile];
                sqlRules += `${sqlFile} : ${jsFile}\n`;
                sqlRules += `\tnode $< $@\n`;
            }
        }
        console.log(`Creating JS rules include file: ${options.jsRulesFile}`);
        await mkdir(dirname(options.jsRulesFile), {recursive: true});
        await writeFile(options.jsRulesFile, jsRules);
        console.log(`Creating SQL rules include file: ${options.sqlRulesFile}`);
        await mkdir(dirname(options.sqlRulesFile), {recursive: true});
        await writeFile(options.sqlRulesFile, sqlRules);
        console.log(`Creating test report rules include file: ${options.reportRulesFile}`);
        await mkdir(dirname(options.reportRulesFile), {recursive: true});
        await writeFile(
            options.reportRulesFile,
            `$(SUPATEST_TEST_REPORT): ${sqlFiles.join(' ')} | $(SUPATEST_TEST_DIR)\n` +
            `\t$(TOOLS_DIR)/scripts/supabase_test.sh $(SUPATEST_OUTPUT_DIR) $? | tee $@\n`
        );
    });