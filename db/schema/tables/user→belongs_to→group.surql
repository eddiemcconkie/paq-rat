DEFINE TABLE belongs_to SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE id INSIDE $auth->belongs_to->group<-belongs_to
;

DEFINE FIELD in ON belongs_to
  TYPE record<user>
;

DEFINE FIELD out ON belongs_to
  TYPE record<group>
;

DEFINE FIELD role ON belongs_to
  TYPE record<role>
;

DEFINE INDEX user_belongs_to_group ON belongs_to
  FIELDS in, out UNIQUE
;
