DEFINE FUNCTION fn::role_for_group($gorup: record<group>) {
  RETURN ($group<-(belongs_to WHERE $auth INSIDE id<-user).role)[0] OR role:none;
};
