-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'basic', 'pro')),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SECURITY DEFINER function to avoid RLS recursion on admin checks
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sites table
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  subdomain text unique not null,
  custom_domain text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sites enable row level security;

create policy "Users can view own sites"
  on public.sites for select
  using (auth.uid() = user_id);

create policy "Users can insert own sites"
  on public.sites for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sites"
  on public.sites for update
  using (auth.uid() = user_id);

create policy "Users can delete own sites"
  on public.sites for delete
  using (auth.uid() = user_id);

create policy "Admins can view all sites"
  on public.sites for select
  using (public.is_admin());

-- Pages table
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade not null,
  title text not null default '首頁',
  slug text not null default '',
  content_json jsonb not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

create policy "Users can view own pages"
  on public.pages for select
  using (
    exists (select 1 from public.sites where id = pages.site_id and user_id = auth.uid())
  );

create policy "Users can insert own pages"
  on public.pages for insert
  with check (
    exists (select 1 from public.sites where id = pages.site_id and user_id = auth.uid())
  );

create policy "Users can update own pages"
  on public.pages for update
  using (
    exists (select 1 from public.sites where id = pages.site_id and user_id = auth.uid())
  );

create policy "Users can delete own pages"
  on public.pages for delete
  using (
    exists (select 1 from public.sites where id = pages.site_id and user_id = auth.uid())
  );

-- Modules table (managed by admin)
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('hero', 'feature', 'gallery', 'cta', 'footer', 'other')),
  thumbnail_url text,
  html text not null default '',
  css text not null default '',
  js text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Anyone authenticated can view active modules"
  on public.modules for select
  using (is_active = true);

create policy "Admins can manage modules"
  on public.modules for all
  using (public.is_admin());

-- Deployments table
create table public.deployments (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade not null,
  vercel_url text,
  preview_url text,
  status text not null default 'pending' check (status in ('pending', 'building', 'success', 'failed')),
  error_log text,
  created_at timestamptz not null default now()
);

alter table public.deployments enable row level security;

create policy "Users can view own deployments"
  on public.deployments for select
  using (
    exists (select 1 from public.sites where id = deployments.site_id and user_id = auth.uid())
  );

create policy "Admins can view all deployments"
  on public.deployments for select
  using (public.is_admin());

-- Updated_at triggers
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sites_updated_at
  before update on public.sites
  for each row execute procedure public.update_updated_at();

create trigger pages_updated_at
  before update on public.pages
  for each row execute procedure public.update_updated_at();

-- Indexes
create index idx_sites_user_id on public.sites(user_id);
create index idx_pages_site_id on public.pages(site_id);
create index idx_deployments_site_id on public.deployments(site_id);
create index idx_modules_category on public.modules(category);

-- Storage bucket for media
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict do nothing;

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Anyone can view media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Users can delete own media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]);

-- Storage bucket for deployed sites
insert into storage.buckets (id, name, public)
values ('deployments', 'deployments', true)
on conflict do nothing;

create policy "System can manage deployments storage"
  on storage.objects for all
  using (bucket_id = 'deployments');
