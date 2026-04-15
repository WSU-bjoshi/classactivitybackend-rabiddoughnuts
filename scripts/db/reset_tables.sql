-- Reset local table state without dropping the whole database.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;
