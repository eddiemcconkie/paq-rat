DEFINE FUNCTION fn::owned_group() {
  RETURN ($auth->(belongs_to WHERE role = role:owner).out)[0];
};
