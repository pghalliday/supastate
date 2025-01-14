import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = create.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});
const usersPrimaryKey = create.addNotNullConstraint({column: usersIdColumn, external: true});
const publicSchema = create.addSchema({name: 'public', external: true});
const publicT1Table = create.addTable({name: 't1', schema: publicSchema});
const publicT1IdColumn = create.addColumn({table: publicT1Table, name: 'id', type: 'uuid'});
const publicT1PrimaryKey = create.addNotNullConstraint({column: publicT1IdColumn});
const s1Schema = create.addSchema({name: 's1'});
const s1T1Table = create.addTable({name: 't1', schema: s1Schema});
const s1T1IdColumn = create.addColumn({table: s1T1Table, name: 'id', type: 'uuid'});
const s1T1PrimaryKey = create.addNotNullConstraint({column: s1T1IdColumn});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
