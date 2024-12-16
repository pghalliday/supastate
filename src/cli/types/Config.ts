import {resolve} from "node:path";

export interface IConfig {
    name: string;
    supastateModule: string;
    targetJsonFile: string;
    currentJsonFile: string;
    migrationsDir: string;
}

const DEFAULT_CONFIG: IConfig = {
    name: 'supastate',
    supastateModule: 'index.js',
    targetJsonFile: 'json/target.json',
    currentJsonFile: 'json/current.json',
    migrationsDir: '../supabase/migrations',
}

export function createConfig(rootDir: string, init: Partial<IConfig> = {}): IConfig {
    const config = {...DEFAULT_CONFIG, ...init};
    return {
        ...config,
        supastateModule: resolve(rootDir, config.supastateModule),
        targetJsonFile: resolve(rootDir, config.targetJsonFile),
        currentJsonFile: resolve(rootDir, config.currentJsonFile),
        migrationsDir: resolve(rootDir, config.migrationsDir),
    };
}
