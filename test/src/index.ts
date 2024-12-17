import {Supastate, RootTableFactory, InformationTableFactory} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
    const authSchema = supastate.addSchema({name: 'auth', external: true});
    const usersTable = supastate.addTable({name: 'users', schema: authSchema, external: true});

    const publicSchema = supastate.addSchema({name: 'public', external: true});
    const publicT1Table = supastate.addTable({name: 't1', schema: publicSchema});

    const s1Schema = supastate.addSchema({name: 's1'});
    const s1T1Table = supastate.addTable({name: 't1', schema: s1Schema});

    const rootTableFactory = new RootTableFactory(supastate);

    const s1t2RootTable = rootTableFactory.addRootTable({
        name: 't2',
        schema: s1Schema,
        primaryKeyColumnName: 'id',
        primaryKeyColumnType: 'uuid',
    });

    const informationTableFactory = new InformationTableFactory(supastate);

    const s1t3InfoTable = informationTableFactory.addInformationTable({
        name: 't3',
        schema: s1Schema,
        foreignKeyColumnName: 'id',
        ownerTable: s1t2RootTable,
    });

}
