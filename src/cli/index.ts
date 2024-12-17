import {Command} from 'commander';
import {mkdir, writeFile, readFile, copyFile, readdir, unlink} from "node:fs/promises";
import {resolve, dirname} from "node:path";
import {deserialize, serialize, type Serialized} from "./serialization.js";
import {newerThan, timestampedFileName, toISO} from "./timestamp.js";
import {createConfig} from "./types/Config.js";
import type {Options} from "./types/Options.js";
import type {Entities} from "../models/Entities.js";
import {Supastate} from "../Supastate.js";
import {migrate} from "../migration/migrate.js";
import {initEntityControllers} from "../controllers/EntityControllers.js";
const __dirname = import.meta.dirname;

const packageJson = await readFile(resolve(__dirname, '../../package.json'), 'utf8');
const packageConf = JSON.parse(packageJson);

export const program = new Command()
    .name(packageConf.name)
    .description(packageConf.description)
    .version(packageConf.version);

program
    .option('-c, --config <config>', 'Path to the supastate configuration', './supastate.json')
    .hook('preAction', async (thisCommand: Command, actionCommand: Command) => {
        const resolvedConfigFile = resolve(thisCommand.opts().config);
        console.log(`Reading config from ${resolvedConfigFile}`);
        const rootDir = dirname(resolvedConfigFile);
        const configJson = await readFile(resolvedConfigFile, 'utf8');
        console.log(`Setting root directory to ${rootDir}`);
        actionCommand.setOptionValue('config', createConfig(rootDir, JSON.parse(configJson)));
    });

program
    .command('initCurrentJson')
    .description('Initialize the current JSON configuration as an empty supastate at the current time')
    .action(async (options: Options) => {
        console.log(`Initializing ${options.config.currentJsonFile}`);
        const serialized = serialize({});
        const currentJson = JSON.stringify(serialized, null, 2);
        await mkdir(dirname(options.config.currentJsonFile), {recursive: true});
        await writeFile(options.config.currentJsonFile, currentJson, 'utf8');
    });

program
    .command('createMigration')
    .description(
        'Create a target JSON configuration from a supastate module then ' +
        'create the SQL migration for the difference between the ' +
        'current JSON config and the target JSON config'
    )
    .action(async (options: Options) => {
        console.log(`Serializing ${options.config.supastateModule} to ${options.config.targetJsonFile}`);
        const targetEntities: Entities = {};
        (await import(options.config.supastateModule)).configure(new Supastate(targetEntities));
        const targetSerialized = serialize(targetEntities);
        const targetTimestamp = targetSerialized.timestamp;
        const targetJson = JSON.stringify(targetSerialized, null, 2);
        await mkdir(dirname(options.config.targetJsonFile), {recursive: true});
        await writeFile(options.config.targetJsonFile, targetJson, 'utf8');
        console.log(`Generating migration from ${options.config.currentJsonFile} to ${options.config.targetJsonFile}`);
        const currentJson = await readFile(options.config.currentJsonFile, 'utf8');
        const currentSerialized:Serialized = JSON.parse(currentJson);
        const currentTimestamp = currentSerialized.timestamp;
        const currentEntities = deserialize(currentSerialized);
        // delete any migration files newer than current serialized
        console.log(`Removing migrations for ${options.config.name} after ${toISO(currentTimestamp)}`);
        await mkdir(options.config.migrationsDir, {recursive: true});
        await Promise.all(
            (await readdir(options.config.migrationsDir, {recursive: true}))
            .filter(newerThan(currentTimestamp, options.config.name))
            .map(async migrationFile => {
                const resolvedMigrationFile = resolve(options.config.migrationsDir, migrationFile);
                console.log(`Deleting migration file ${resolvedMigrationFile}`);
                await unlink(resolvedMigrationFile);
            })
        );
        // construct the file name for the new migration
        const migrationFile = timestampedFileName(targetTimestamp, options.config.name);
        const resolvedMigrationFile = resolve(options.config.migrationsDir, migrationFile);
        // generate the new migration file
        console.log(`Generating migration file ${resolvedMigrationFile}`);
        await writeFile(resolvedMigrationFile, migrate(
            initEntityControllers(currentEntities),
            initEntityControllers(targetEntities)
        ));
    });

program
    .command('applyMigration')
    .description(
        'Overwrite the current JSON config with the target JSON config to mark it as applied'
    )
    .action(async (options: Options) => {
        console.log(`Overwriting ${options.config.currentJsonFile} with ${options.config.targetJsonFile}`);
        await mkdir(dirname(options.config.currentJsonFile), {recursive: true});
        await copyFile(options.config.targetJsonFile, options.config.currentJsonFile);
    });
