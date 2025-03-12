INSERT INTO workouts (user_id, date, exercise_name, sets, reps, weight)
VALUES (1, '2024-03-11', 'Benkpress', 3, 10, 80)
RETURNING *;
