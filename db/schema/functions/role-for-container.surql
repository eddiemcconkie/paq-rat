DEFINE FUNCTION fn::role_for_container($container: record<container>) {
  RETURN ($container<-stores<-group<-(belongs_to WHERE $auth INSIDE id<-user).role)[0] OR role:none;
};
