DEFINE TABLE user SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE id INSIDE $auth->belongs_to->group<-belongs_to<-user
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
