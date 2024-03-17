DEFINE TABLE stores SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE id INSIDE $auth->belongs_to->group->stores
    -- FOR create
      -- WHERE $auth INSIDE in<-belongs_to<-user
    FOR delete
      WHERE fn::role_for_container(out) = role:owner
;

DEFINE FIELD in ON stores
  TYPE record<group>
;

DEFINE FIELD out ON stores
  TYPE record<container>
;

DEFINE INDEX one_group_per_container ON stores FIELDS out UNIQUE;
