DEFINE SCOPE user SESSION 30d
  SIGNIN (SELECT VALUE userId.* FROM type::thing('session', $sessionId))
;
