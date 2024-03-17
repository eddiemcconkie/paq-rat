DEFINE TABLE group SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE id INSIDE $auth->belongs_to->group
;


