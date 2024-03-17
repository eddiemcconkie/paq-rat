DEFINE TABLE role SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
;

DEFINE FIELD level ON role
  TYPE int
;
