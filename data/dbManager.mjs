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

const dbManager = { create, update, read, purge };
export default dbManager;
