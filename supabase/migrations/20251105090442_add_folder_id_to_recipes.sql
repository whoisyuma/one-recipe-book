-- migration up
-- 1. カラムを追加
alter table recipes add column folder_id uuid;

-- 2. 外部キー制約を追加
alter table recipes
  add constraint fk_folder
  foreign key (folder_id) references folders(id) on delete set null;
