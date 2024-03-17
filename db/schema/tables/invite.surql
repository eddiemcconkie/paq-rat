DEFINE TABLE invite SCHEMAFULL
  PERMISSIONS
    FOR create
      FULL
    FOR select
      WHERE owner = $auth
;

DEFINE FIELD owner ON invite
  TYPE record<user>
;

DEFINE FIELD group ON invite
  TYPE record<group>
;

DEFINE FIELD role ON invite
  TYPE record<role>
;

DEFINE FIELD expires ON invite
  TYPE datetime
  DEFAULT time::now() + 1d
;
