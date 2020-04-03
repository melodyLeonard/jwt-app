
-- this is the database

CREATE DATABASE jwtapp;






-- this is the users table 

CREATE TABLE users(
   user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_name VARCHAR(255) NOT NULL,
   user_email VARCHAR(255) NOT NULL,
   user_password VARCHAR(255) NOT NULL
);


-- this is a dummy user created for testing

INSERT INTO users (user_name, user_email, user_password) 
VALUES ('melodyleonard', 'melodyleonard7@gmail.com', 'bobbyclinton');








-- this is a posts table with a foreign key that points at the users id --

CREATE TABLE posts(
   post_id SERIAL PRIMARY KEY,
   post_title VARCHAR(255) NOT NULL,
   post_body VARCHAR(5000) NOT NULL,
   post_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   post_author_id uuid,
   FOREIGN KEY(post_author_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- this is a dummy post created for testing --

INSERT INTO posts (post_title, post_body, post_author_id) 
VALUES ('first', 'This is my first post', '4a231d22-9b28-46c8-a843-125b6354e995');