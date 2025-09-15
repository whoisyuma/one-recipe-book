create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  image_url text,
  ingredients jsonb,
  steps text[],
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLSを有効化
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 自分のレシピだけ操作可能なポリシーを作成
CREATE POLICY "Users can manage their own recipes" ON recipes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
