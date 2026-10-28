-- Fase 1A: incremental. Revisar/aprobar antes de aplicar remotamente.
begin;

alter table public.tenants add column if not exists phone text;
alter table public.tenants add column if not exists address text;
alter table public.tenants add column if not exists created_by uuid references auth.users(id);
create unique index if not exists tenants_created_by_unique on public.tenants(created_by) where created_by is not null;
create index if not exists memberships_user_tenant_idx on public.memberships(user_id, tenant_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 25),
  created_at timestamptz not null default now()
);
create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.platform_admins enable row level security;

-- Si ya existe otra autorización, no mezclar políticas permisivas inadvertidamente.
do $$
begin
  if exists (select 1 from pg_catalog.pg_policies where schemaname = 'public'
      and tablename in ('tenants', 'memberships', 'profiles', 'platform_admins')) then
    raise exception 'Revisar las políticas existentes antes de aplicar Fase 1A';
  end if;
end;
$$;

revoke all on public.tenants, public.memberships, public.profiles, public.platform_admins from public, anon, authenticated;
grant select on public.tenants, public.memberships, public.profiles, public.platform_admins to authenticated;

create policy identity_self_profile on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy identity_self_membership on public.memberships for select to authenticated using (user_id = (select auth.uid()));
create policy identity_member_tenant on public.tenants for select to authenticated using (
  exists (select 1 from public.memberships m where m.tenant_id = tenants.id and m.user_id = (select auth.uid()))
);
create policy identity_self_platform_admin on public.platform_admins for select to authenticated using (user_id = (select auth.uid()));

create function public.create_laundry(
  p_business_name text, p_owner_name text, p_phone text, p_address text default ''
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  business_id uuid;
begin
  if actor is null or not exists (select 1 from auth.users u where u.id = actor and u.email_confirmed_at is not null) then
    raise exception 'Cuenta confirmada requerida' using errcode = '42501';
  end if;
  if p_business_name is null or char_length(btrim(p_business_name)) not between 2 and 120
    or p_owner_name is null or char_length(btrim(p_owner_name)) not between 2 and 120
    or p_phone is null or char_length(btrim(p_phone)) not between 7 and 25
    or btrim(p_phone) !~ '^[+0-9() .-]+$'
    or char_length(pg_catalog.regexp_replace(p_phone, '[^0-9]', '', 'g')) < 7
    or p_address is null or char_length(btrim(p_address)) > 300 then
    raise exception 'Datos de lavandería inválidos' using errcode = '22023';
  end if;

  -- Serializa solicitudes del mismo usuario; repetir devuelve el mismo negocio.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text, 0));
  select m.tenant_id into business_id from public.memberships m
    where m.user_id = actor and m.role = 'owner' order by m.tenant_id limit 1;
  if business_id is not null then return business_id; end if;
  -- Impide crear otro negocio si una membresía se revocó fuera de esta fase.
  if exists (select 1 from public.tenants where created_by = actor) then
    raise exception 'El negocio requiere revisión de acceso' using errcode = '42501';
  end if;

  insert into public.profiles(id, full_name, phone)
    values(actor, btrim(p_owner_name), btrim(p_phone)) on conflict(id) do nothing;
  insert into public.tenants(name, phone, address, created_by)
    values(btrim(p_business_name), btrim(p_phone), nullif(btrim(p_address), ''), actor) returning id into business_id;
  insert into public.memberships(tenant_id, user_id, role) values(business_id, actor, 'owner');
  return business_id;
end;
$$;
revoke all on function public.create_laundry(text, text, text, text) from public, anon;
grant execute on function public.create_laundry(text, text, text, text) to authenticated;
comment on function public.create_laundry(text, text, text, text) is
  'Alta atómica de un negocio y su propietario desde auth.uid(); sin parámetros de privilegios ni suscripciones.';

commit;
