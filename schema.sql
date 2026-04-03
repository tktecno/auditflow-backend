-- Enable UUID extension
create extension if not exists "uuid-ossp";

--------------------------------------------------
-- ORGANIZATIONS
--------------------------------------------------
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp default now()
);

--------------------------------------------------
-- ROLES
--------------------------------------------------
create table roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

--------------------------------------------------
-- PERMISSIONS
--------------------------------------------------
create table permissions (
  id uuid primary key default uuid_generate_v4(),
  action text not null unique
);

--------------------------------------------------
-- ROLE PERMISSIONS (M:N)
--------------------------------------------------
create table role_permissions (
  role_id uuid references roles(id) on delete cascade,
  permission_id uuid references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

--------------------------------------------------
-- USERS
--------------------------------------------------
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  password text not null,
  role_id uuid references roles(id),
  org_id uuid references organizations(id),
  status text default 'ACTIVE',
  created_at timestamp default now()
);

--------------------------------------------------
-- FINANCIAL RECORDS
--------------------------------------------------
create table financial_records (
  id uuid primary key default uuid_generate_v4(),
  amount numeric not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category text,
  date date not null,
  notes text,
  status text default 'PENDING',
  is_deleted boolean default false,
  created_by uuid references users(id),
  org_id uuid references organizations(id),
  created_at timestamp default now()
);

--------------------------------------------------
-- AUDIT LOGS
--------------------------------------------------
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  action text not null,
  record_id uuid references financial_records(id) on delete set null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamp default now()
);

--------------------------------------------------
-- INDEXES (Performance Optimization)
--------------------------------------------------
create index idx_records_org on financial_records(org_id);
create index idx_records_status on financial_records(status);
create index idx_records_deleted on financial_records(is_deleted);

--------------------------------------------------
-- SEED DATA
--------------------------------------------------

-- Roles
insert into roles (name) values
('ADMIN'),
('ANALYST'),
('VIEWER');

-- Permissions
insert into permissions (action) values
('CREATE'),
('READ'),
('UPDATE'),
('DELETE'),
('APPROVE');

--------------------------------------------------
-- ROLE PERMISSIONS MAPPING
--------------------------------------------------

-- ADMIN → all permissions
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r, permissions p
where r.name = 'ADMIN';

-- ANALYST → limited permissions
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r, permissions p
where r.name = 'ANALYST'
and p.action in ('CREATE', 'READ', 'UPDATE');

-- VIEWER → read only
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r, permissions p
where r.name = 'VIEWER'
and p.action = 'READ';