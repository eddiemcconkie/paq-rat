DEFINE FUNCTION fn::group_owner($group: record<group>) {
  RETURN ($group<-(belongs_to WHERE role = role:owner)<-user)[0];
};
