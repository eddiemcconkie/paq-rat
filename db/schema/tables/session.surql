DEFINE TABLE session SCHEMAFULL
  PERMISSIONS NONE
;

DEFINE FIELD userId ON session
  TYPE record<user>
;

DEFINE FIELD expiresAt ON session
  TYPE datetime
;

DEFINE FIELD fresh ON session
  TYPE bool
;
