-- What: Creates profiles and settings tables
-- Why: To store user details, roles, and global application settings
-- Dependencies: 001_extensions.sql

create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    phone text,
    role text default 'user' check (role in ('user', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.addresses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    full_name text not null,
    phone text not null,
    address_line_1 text not null,
    address_line_2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value jsonb not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_addresses_user_id on public.addresses(user_id);
