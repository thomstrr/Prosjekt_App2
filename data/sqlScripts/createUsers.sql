INSERT INTO users (name, email, password) 
VALUES ('Testbruker', 'testbruker@example.com', 'passord123')
RETURNING *;
