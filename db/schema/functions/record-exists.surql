DEFINE FUNCTION fn::record_exists($record: record) {
  RETURN $record.id != NONE;
};

DEFINE FUNCTION fn::not_record_exists($record: record) {
  RETURN $record.id = NONE;
};
