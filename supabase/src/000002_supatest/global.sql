create function st_has_rls(schemaname name, tablename name) returns text as $_api_$
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
        array [true],
        format('RLS should be enabled for %I.%I', schemaname, tablename)
   )
$_api_$ language sql;

create function st_has_security_invoker(schemaname name, viewname name) returns text as $_api_$
    select results_eq(
        format($$
            select
                -- lower case the options text and extract array, then check if any
                -- elements match elements in our array of possibilities for the
                -- security_invoker option being enabled
                lower(c.reloptions::text)::text[] &&
                array['security_invoker=1','security_invoker=true','security_invoker=on']
            from pg_class c
            join pg_catalog.pg_namespace n on n.oid = pg_class.relnamespace
            where n.nspname = %L -- filter on the schema
                and c.relname= %L -- filter on the viewname
                and c.relkind='v' -- only select views
        $$, schemaname, viewname),
        array [true],
        format('The security_invoker option should be enabled for %I.%I', schemaname, viewname)
    );
$_api_$ language sql;
