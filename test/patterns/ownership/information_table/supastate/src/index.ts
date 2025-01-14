import {Supastate, RootTableFactory, InformationTableFactory} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();

const authSchema = create.addSchema({name: 'auth', external: true});
const s1Schema = create.addSchema({name: 's1'});

const rootTableFactory = new RootTableFactory(create);
const informationTableFactory = new InformationTableFactory(create);

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

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
