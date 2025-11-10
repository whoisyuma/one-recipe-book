-- migration up
alter table recipes
add column folder_id uuid references folders(id) on delete set null;

-- migration down
alter table recipes
drop column folder_id;