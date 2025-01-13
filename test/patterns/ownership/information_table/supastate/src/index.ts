import {mkdir, writeFile} from "node:fs/promises";
import {Supastate, RootTableFactory, InformationTableFactory} from "@pghalliday/supastate";

const supastate = new Supastate();

const authSchema = supastate.addSchema({name: 'auth', external: true});
const s1Schema = supastate.addSchema({name: 's1'});

const rootTableFactory = new RootTableFactory(supastate);
const informationTableFactory = new InformationTableFactory(supastate);

const usersTable = rootTableFactory.addRootTable({
    name: 'users',
    schema: authSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    external: true,
});

const s1t1InfoTable = informationTableFactory.addInformationTable({
    name: 't1_info',
    schema: s1Schema,
    foreignKeyColumnName: 'id',
    ownerTable: usersTable,
});

await mkdir('../sql', {recursive: true});
await writeFile('../sql/supastate.sql', supastate.migrate({}));
