DEFINE EVENT create_user_group ON TABLE user WHEN $event = "CREATE" THEN {
  LET $group = (CREATE group);
  RELATE $after->belongs_to->$group SET role = role:owner;
};
