-- migration up
create table folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLSを有効化
alter table folders enable row level security;

-- 自分のフォルダだけ読み書きできるポリシーを作成
create policy "Users can manage their own folders"
  on folders
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
