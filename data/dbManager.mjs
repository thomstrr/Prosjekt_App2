import connectionPool from "./database.mjs";

async function runQuery(query, ...values) {
  try {
    const result = await connectionPool.query(query, values);
    if (result.rowCount === 0) throw new Error("No records affected");
    return result.rows;
  } catch (error) {
    console.error("Databasefeil:", error);
    return null;
  }
}

async function create(query, ...values) {
  return await runQuery(query, ...values);
}
async function update(query, ...values) {
  return await runQuery(query, ...values);
}
async function read(query, ...values) {
  return await runQuery(query, ...values);
}
async function purge(query, ...values) {
  return await runQuery(query, ...values);
}

async function findUserByEmail(email) {
  const result = await runQuery("SELECT * FROM users WHERE email = $1", email);
  return result ? result[0] : null;
}

async function createUser(name, email, passwordHash) {
  return await runQuery(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    name,
    email,
    passwordHash
  );
}

async function getWorkoutsByUser(userId) {
  try {
    return await runQuery("SELECT * FROM workouts WHERE user_id = $1", userId);
  } catch (error) {
    console.error("Feil ved henting av workouts:", error);
    return [];
  }
}

async function createWorkout(userId, date, exercise_name, sets, reps, weight) {
  if (!userId) {
    throw new Error("Workout må være knyttet til en innlogget bruker");
  }

  try {
    return await runQuery(
      "INSERT INTO workouts (user_id, date, exercise_name, sets, reps, weight) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, date, exercise_name, sets, reps, weight",
      userId, date, exercise_name, sets, reps, weight
    );
  } catch (error) {
    throw new Error("Kunne ikke opprette workout");
  }
}

const dbManager = {
  create,
  update,
  read,
  purge,
  findUserByEmail,
  createUser,
  getWorkoutsByUser,
  createWorkout,
};

export default dbManager;
