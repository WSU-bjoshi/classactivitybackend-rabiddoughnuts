-- #1
-- CREATE DATABASE todo_db;


-- USE todo_db;

-- -- #2
-- CREATE TABLE todos(
-- id INT AUTO_INCREMENT PRIMARY KEY,
-- task VARCHAR(255),
-- completed BOOLEAN DEFAULT FALSE);


-- -- #3k
-- INSERT INTO todos(task) VALUES
-- ("Demo MYSQL Connection"),
-- ("Complete Model"),
-- ("Complete Server");

-- SELECT id, task, completed FROM todos WHERE id>1;

-- Canonical schema for current backend models and services.
CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
	user_name VARCHAR(255) NULL,
	user_email VARCHAR(255) NOT NULL UNIQUE,
	user_password VARCHAR(255) NOT NULL,
	user_role ENUM('admin', 'staff', 'user') NOT NULL DEFAULT 'user',
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
	task_id INT AUTO_INCREMENT PRIMARY KEY,
	tasks VARCHAR(255) NOT NULL,
	completed BOOLEAN DEFAULT FALSE,
	in_use BOOLEAN NOT NULL DEFAULT TRUE,
	user_id INT NOT NULL,
	createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_todos_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	INDEX idx_todos_user_id (user_id)
);