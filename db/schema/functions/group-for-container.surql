DEFINE FUNCTION fn::group_for_container($container: record<container>) {
  RETURN ($container<-stores<-group.id)[0]
};
