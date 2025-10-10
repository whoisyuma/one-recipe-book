-- RLS を有効にする
alter table recipes enable row level security;

-- 既存のポリシーがあれば削除（安全のため）
drop policy if exists "Users can manage their own recipes" on recipes;

-- 自分のレシピだけ読み書きできるポリシーを作成
create policy "Users can manage their own recipes"
  on recipes
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
