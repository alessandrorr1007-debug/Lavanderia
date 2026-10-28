-- Esquema inicial para revisión. No aplicar sin configurar Auth y validar políticas.
create extension if not exists pgcrypto;
create table if not exists public.tenants(id uuid primary key default gen_random_uuid(),name text not null,created_at timestamptz not null default now());
create table if not exists public.memberships(tenant_id uuid not null references public.tenants(id),user_id uuid not null references auth.users(id),role text not null check(role in ('owner','worker')),primary key(tenant_id,user_id));
create table if not exists public.customers(id uuid primary key default gen_random_uuid(),tenant_id uuid not null references public.tenants(id),name text not null,phone text,created_at timestamptz not null default now(),unique(tenant_id,id));
create table if not exists public.services(id uuid primary key default gen_random_uuid(),tenant_id uuid not null references public.tenants(id),name text not null,unit text not null check(unit in ('kg','prenda','unidad')),price numeric(12,2) not null check(price>=0),active boolean not null default true,unique(tenant_id,id));
create table if not exists public.orders(id uuid primary key default gen_random_uuid(),tenant_id uuid not null references public.tenants(id),customer_id uuid not null,status text not null default 'received' check(status in ('received','washing','drying','ironing','ready','delivered','cancelled')),total numeric(12,2) not null default 0 check(total>=0),created_at timestamptz not null default now(),unique(tenant_id,id),foreign key(tenant_id,customer_id) references public.customers(tenant_id,id));
create table if not exists public.order_items(id uuid primary key default gen_random_uuid(),tenant_id uuid not null,order_id uuid not null,service_id uuid not null,quantity numeric(12,3) not null check(quantity>0),unit_price numeric(12,2) not null check(unit_price>=0),foreign key(tenant_id,order_id) references public.orders(tenant_id,id),foreign key(tenant_id,service_id) references public.services(tenant_id,id));
create table if not exists public.order_status_history(id uuid primary key default gen_random_uuid(),tenant_id uuid not null,order_id uuid not null,status text not null,changed_by uuid references auth.users(id),changed_at timestamptz not null default now(),foreign key(tenant_id,order_id) references public.orders(tenant_id,id));
create table if not exists public.cash_sessions(id uuid primary key default gen_random_uuid(),tenant_id uuid not null references public.tenants(id),opened_by uuid references auth.users(id),opened_at timestamptz not null default now(),closed_at timestamptz,opening_amount numeric(12,2) not null default 0 check(opening_amount>=0),unique(tenant_id,id));
create table if not exists public.payments(id uuid primary key default gen_random_uuid(),tenant_id uuid not null,order_id uuid not null,amount numeric(12,2) not null check(amount>0),method text not null,created_at timestamptz not null default now(),foreign key(tenant_id,order_id) references public.orders(tenant_id,id));
create table if not exists public.cash_movements(id uuid primary key default gen_random_uuid(),tenant_id uuid not null,cash_session_id uuid not null,amount numeric(12,2) not null,reason text not null,created_at timestamptz not null default now(),foreign key(tenant_id,cash_session_id) references public.cash_sessions(tenant_id,id));
create table if not exists public.subscriptions(id uuid primary key default gen_random_uuid(),tenant_id uuid not null references public.tenants(id),plan_code text not null,status text not null default 'trial',expires_at timestamptz);
create table if not exists public.audit_logs(id uuid primary key default gen_random_uuid(),tenant_id uuid references public.tenants(id),actor_id uuid references auth.users(id),action text not null,created_at timestamptz not null default now());
-- RLS: denegar acceso por defecto. Políticas operativas serán creadas y probadas en Fase 1.
alter table public.tenants enable row level security;
alter table public.memberships enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.cash_sessions enable row level security;
alter table public.payments enable row level security;
alter table public.cash_movements enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_logs enable row level security;
-- No existen políticas ALLOW todavía: acceso de cliente autenticado/anon bloqueado por defecto.
