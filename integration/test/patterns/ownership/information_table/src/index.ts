import {Supastate} from "@pghalliday/supastate";
import {RootTableFactory, InformationTableFactory} from "@pghalliday/supastate/patterns/ownership";
import {Supatest} from "@pghalliday/supatest";

const supatest = new Supatest();

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

supatest.setSupastate(create);

supatest.hasTable(s1t1InfoTable.table);
supatest.hasRLS(s1t1InfoTable.table);
supatest.colIsPk(s1t1InfoTable.primaryKeyColumn);
supatest.fkOk(s1t1InfoTable.foreignKeyConstraint);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.colIsPk(usersTable.primaryKeyColumn);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
