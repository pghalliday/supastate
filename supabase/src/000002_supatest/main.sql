create extension if not exists pg_tle;
drop extension if exists supatest;
select pgtle.uninstall_extension_if_exists('supatest');
select pgtle.install_extension(
    'supatest',
    '0.1',
    'Test utilities for use with Supastate',
    $_pgtle_$

#include "global.sql"

#include "uuid.sql"

#include "supabase_test_helpers.sql"

    $_pgtle_$,
    -- Uses functions from supabase_test_helpers
    array[
        'pgtap',
        'basejump-supabase_test_helpers'
    ]
);
