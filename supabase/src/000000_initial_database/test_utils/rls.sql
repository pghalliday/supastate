create function has_rls(schemaname name, tablename name) returns text as $_func_$
    select results_eq(
        format(
            $$
                select rowsecurity
                from pg_tables
                where schemaname = %L
                and tablename = %L
            $$,
            schemaname,
            tablename
        ),
        array[true],
        format('RLS should be enabled for %I.%I', schemaname, tablename)
   )
$_func_$ language sql;
