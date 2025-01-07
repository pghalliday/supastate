import {Supastate, RootTableFactory, InformationTableFactory} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
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
}
