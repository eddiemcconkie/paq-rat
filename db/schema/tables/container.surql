DEFINE TABLE container SCHEMAFULL
  PERMISSIONS
    FOR select, update
      WHERE fn::role_for_container(id).level >= visibility.level
      -- WHERE id<-stores<-group<-(belongs_to WHERE $auth INSIDE id<-user).role.level >= visibility.level
    FOR create
      NONE
      -- FULL
    FOR delete
      WHERE fn::role_for_container(id) = role:owner
      -- WHERE id INSIDE $auth->(belongs_to WHERE role = role:owner)->group->stores->container
;

DEFINE FIELD label ON container
  TYPE string
  DEFAULT ''
;

DEFINE FIELD type ON container
  TYPE string
  DEFAULT ''
;

DEFINE FIELD location ON container
  TYPE string
  DEFAULT ''
;

DEFINE FIELD contents ON container
  TYPE array<string>
  DEFAULT []
;
DEFINE FIELD contents.* ON container
  TYPE string
;

DEFINE FIELD visibility ON container
  TYPE record<role>
  PERMISSIONS
    FOR update
      WHERE fn::role_for_container(id) = role:owner
;

DEFINE FIELD created ON container
  VALUE time::now()
  READONLY
;

DEFINE FIELD updated ON container
  VALUE time::now()
;
