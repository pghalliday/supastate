import {Supatest} from "@pghalliday/supatest";
import {Supasql} from "@pghalliday/supasql";
import {create, profilesTable, profilesUserIdColumn} from "./supastates/create.js";

const supatest = new Supatest();
const supasql = new Supasql();

supatest.setSupastate(create);
supasql.addSupastate(create);

supatest.createSupabaseUser('user_1');
supatest.createSupabaseUser('user_2');
supatest.clearAuthentication();

supatest.throwsOk(
    supasql.insert()
        .into(profilesTable)
        .columns([profilesUserIdColumn])
        .values([supasql.getSupabaseUID('user_1')])
        .build(),
    'new row violates row-level security policy for table "profiles"',
    'Unauthenticated users should not be able to insert into profiles'
);

supatest.authenticateAs('user_1');

supatest.throwsOk(
    supasql.insert()
        .into(profilesTable)
        .columns([profilesUserIdColumn])
        .values([supasql.getSupabaseUID('user_2')])
        .build(),
    'new row violates row-level security policy for table "profiles"',
    'Users should not be able to insert into profiles for other users'
);

supatest.livesOk(
    supasql.insert()
        .into(profilesTable)
        .columns([profilesUserIdColumn])
        .values([supasql.getSupabaseUID('user_1')])
        .build(),
    'Authenticated users should be able to insert into profiles for themselves'
);

await supatest.writeSQL();
