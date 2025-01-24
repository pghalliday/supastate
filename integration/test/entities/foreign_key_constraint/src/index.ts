import {Supatest} from "@pghalliday/supatest";
import {Supastate} from "@pghalliday/supastate";

const supatest = new Supatest();

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = create.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});
const usersPrimaryKey = create.addPrimaryKeyConstraint({table: usersTable, name: 'pk', columns: [usersIdColumn], external: true});
const publicSchema = create.addSchema({name: 'public', external: true});
const publicT1Table = create.addTable({name: 't1', schema: publicSchema});
const publicT1IdColumn = create.addColumn({table: publicT1Table, name: 'id', type: 'uuid'});
const publicT1PrimaryKey = create.addPrimaryKeyConstraint({table: publicT1Table, name: 'pk', columns: [publicT1IdColumn]});
const publicT1UserIdColumn = create.addColumn({table: publicT1Table, name: 'user_id', type: 'uuid'});
const publicT1UserForeignKey = create.addForeignKeyConstraint({table: publicT1Table, name: 'fk', columns: [publicT1UserIdColumn], otherTable: usersTable, otherColumns: [usersIdColumn]});
const s1Schema = create.addSchema({name: 's1'});
const s1T1Table = create.addTable({name: 't1', schema: s1Schema});
const s1T1IdColumn = create.addColumn({table: s1T1Table, name: 'id', type: 'uuid'});
const s1T1PrimaryKey = create.addPrimaryKeyConstraint({table: s1T1Table, name: 'pk', columns: [s1T1IdColumn]});
const s1T1UserIdColumn = create.addColumn({table: s1T1Table, name: 'user_id', type: 'uuid'});
const s1T1UserForeignKey = create.addForeignKeyConstraint({table: s1T1Table, name: 'fk', columns: [s1T1UserIdColumn], otherTable: usersTable, otherColumns: [usersIdColumn]});
supatest.setSupastate(create);

supatest.fkOk(publicT1UserForeignKey);
supatest.fkOk(s1T1UserForeignKey);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.hasColumn(usersIdColumn);
supatest.hasSchema(publicSchema);
supatest.hasntTable(publicT1Table);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
