import {Supatest} from "@pghalliday/supatest";
import {getSupabaseUID, Insert} from "@pghalliday/supasql";
import {create, profilesTable, profilesUserIdColumn} from "./supastates/create.js";

export const supatest = new Supatest();

supatest.setSupastate(create);

supatest.createSupabaseUser('user_1');
supatest.createSupabaseUser('user_2');
supatest.clearAuthentication();

supatest.throwsOk(
    new Insert(supatest.knownEntities)
        .into(profilesTable)
        .columns([profilesUserIdColumn])
        .values([getSupabaseUID('user_1')])
        .build(),
    'new row violates row-level security policy for table "profiles"',
    'Unauthenticated users should not be able to insert into profiles'
);

supatest.authenticateAs('user_1');

supatest.throwsOk(
    new Insert(supatest.knownEntities)
        .into(profilesTable)
        .columns([profilesUserIdColumn])
        .values([getSupabaseUID('user_2')])
        .build(),
    'new row violates row-level security policy for table "profiles"',
    'Users should not be able to insert into profiles for other users'
);

supatest.livesOk(
    new Insert(supatest.knownEntities)
        .into(profilesTable)
        .columns([profilesUserIdColumn])
        .values([getSupabaseUID('user_1')])
        .build(),
    'Authenticated users should be able to insert into profiles for themselves'
);

supatest.writeSQL();
