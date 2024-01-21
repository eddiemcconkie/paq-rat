DEFINE SCOPE user SESSION 30d
  SIGNIN (SELECT VALUE user_id.* FROM type::thing('session', $sessionId))
;
