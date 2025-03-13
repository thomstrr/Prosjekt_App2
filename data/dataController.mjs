import dbManager from "./dbManager.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

export const getAllWorkouts = async (req, res) => {
  try {
      const result = await dbManager.read("SELECT * FROM workouts ORDER BY date DESC");
      res.json(result);
  } catch (error) {
      res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getWorkoutById = async (req, res) => {
  const { id } = req.params;
  
  try {
      const result = await dbManager.read("SELECT * FROM workouts WHERE id = $1", id);
      if (!result || result.length === 0) {
          return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Treningsøkt ikke funnet" });
      }
      res.json(result[0]);
  } catch (error) {
      res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createWorkout = async (req, res) => {
  const { date, exercise_name, sets, reps, weight } = req.body;
  
  try {
      const result = await dbManager.create(
          "INSERT INTO workouts (date, exercise_name, sets, reps, weight) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          date, exercise_name, sets, reps, weight
      );
      res.status(HTTP_CODES.SUCCESS.CREATED).json(result[0]);
  } catch (error) {
      res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { date, exercise_name, sets, reps, weight } = req.body;
  try {
      const result = await dbManager.update(
          "UPDATE workouts SET date = $1, exercise_name = $2, sets = $3, reps = $4, weight = $5 WHERE id = $6 RETURNING *",
          date, exercise_name, sets, reps, weight, id
      );
      if (!result || result.length === 0) {
          return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Treningsøkt ikke funnet" });
      }
      res.json(result[0]);
  } catch (error) {
      res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  try {
      const result = await dbManager.purge("DELETE FROM workouts WHERE id = $1 RETURNING *", id);
      if (!result || result.length === 0) {
          return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Treningsøkt ikke funnet" });
      }
      res.json({ message: "Treningsøkt slettet", deletedWorkout: result[0] });
  } catch (error) {
      res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
