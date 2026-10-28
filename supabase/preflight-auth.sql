-- Solo lectura. Ejecutar únicamente tras aprobar la revisión remota.
select table_name, column_name, data_type from information_schema.columns
where table_schema = 'public' order by table_name, ordinal_position;
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_catalog.pg_policies where schemaname = 'public';
select n.nspname, c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r';
select routine_schema, routine_name, security_type from information_schema.routines
where routine_schema = 'public';
