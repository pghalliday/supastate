import {Supastate, RootTableFactory, CollectionTableFactory} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
    const authSchema = supastate.addSchema({name: 'auth', external: true});
    const s1Schema = supastate.addSchema({name: 's1'});

    const rootTableFactory = new RootTableFactory(supastate);
    const collectionTableFactory = new CollectionTableFactory(supastate);

    const usersTable = rootTableFactory.addRootTable({
        name: 'users',
        schema: authSchema,
        primaryKeyColumnName: 'id',
        primaryKeyColumnType: 'uuid',
        external: true,
    });

    const s1t1ColTable = collectionTableFactory.addCollectionTable({
        name: 't1_col',
        schema: s1Schema,
        primaryKeyColumnName: 'id',
        primaryKeyColumnType: 'uuid',
        foreignKeyColumnName: 'user_id',
        ownerTable: usersTable,
    });
}
