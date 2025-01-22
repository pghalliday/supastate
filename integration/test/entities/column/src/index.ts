import {Supatest} from "@pghalliday/supatest";
import {Supastate} from "@pghalliday/supastate";

const supatest = new Supatest();

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = create.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});
const publicSchema = create.addSchema({name: 'public', external: true});
const publicT1Table = create.addTable({name: 't1', schema: publicSchema});
const publicT1IdColumn = create.addColumn({table: publicT1Table, name: 'id', type: 'uuid'});
const s1Schema = create.addSchema({name: 's1'});
const s1T1Table = create.addTable({name: 't1', schema: s1Schema});
const s1T1IdColumn = create.addColumn({table: s1T1Table, name: 'id', type: 'uuid'});
supatest.setSupastate(create);

supatest.colTypeIs(usersIdColumn, 'uuid');
supatest.colTypeIs(publicT1IdColumn, 'uuid');
supatest.colTypeIs(s1T1IdColumn, 'uuid');

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.hasColumn(usersIdColumn);
supatest.hasSchema(publicSchema);
supatest.hasntTable(publicT1Table);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
