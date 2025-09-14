create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  image_url text,
  ingredients jsonb,
  steps text[],
  created_at timestamp with time zone default timezone('utc', now())
);
