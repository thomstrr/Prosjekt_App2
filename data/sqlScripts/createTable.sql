CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    exercise_name TEXT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight DECIMAL NOT NULL
);



