import {Supastate} from "@pghalliday/supastate";
import {Entity, Role} from "@pghalliday/supastate/entities";
import {argv} from "node:process";
import {mkdir, writeFile} from "node:fs/promises";
import {dirname} from "node:path";
import _ from 'lodash';
const {join, split} = _;

export class Supatest {
    private testCount: number = 0;
    private knownEntities: Record<string, Entity> = {};
    private currentEntities: Record<string, Entity> = {};
    private sql: string = '';

    setSupastate(supastate: Supastate) {
        this.sql += supastate.migrate(this.currentEntities);
        this.currentEntities = supastate.entities;
        this.knownEntities = {
            ...this.knownEntities,
            ...this.currentEntities
        };
    }

    hasRole(role: Role) {
        this.sql += `select has_role('${role.name}');\n`;
        this.testCount++;
    }

    hasntRole(role: Role) {
        this.sql += `select hasnt_role('${role.name}');\n`;
        this.testCount++;
    }

    async writeSQL() {
        const sqlFile = argv[2];
        const depsFile = argv[3];
        const inputFiles = argv[4];
        await mkdir(dirname(depsFile), {recursive: true});
        await writeFile(depsFile, `${sqlFile}: ${join(split(inputFiles, '\n'), ' \\\n')}`);
        await mkdir(dirname(sqlFile), {recursive: true});
        await writeFile(sqlFile, `begin;

create extension if not exists pgtap with schema extensions cascade;
create extension if not exists "basejump-supabase_test_helpers";
create extension if not exists supatest with schema extensions cascade;

select plan(${this.testCount});

${this.sql}
select * from finish();

rollback;
`);
    }
}
