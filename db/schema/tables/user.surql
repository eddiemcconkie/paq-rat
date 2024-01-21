DEFINE TABLE user SCHEMAFULL
  PERMISSIONS NONE
  -- In the future, this will change to people in your family/group
;

DEFINE FIELD googleId ON user
  TYPE string
;

DEFINE FIELD givenName ON user
  TYPE option<string>
;

DEFINE FIELD familyName ON user
  TYPE option<string>
;

DEFINE FIELD name ON user
  TYPE string
;

DEFINE FIELD email ON user
  TYPE string
;

DEFINE FIELD picture ON user
  TYPE option<string>
;
