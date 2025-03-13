import express from "express";
import dbManager from "../data/dbManager.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

router.get("/workouts", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).json({ error: "Ikke innlogget" });
  }

  try {
    const workouts = await dbManager.getWorkoutsByUser(req.session.userId);
    res.json(workouts);
  } catch (error) {
    console.error("Feil ved henting av workouts:", error);
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

router.post("/workouts", async (req, res) => {
  try {
    const workout = await dbManager.createWorkout(
      req.session.userId,
      req.body.date,
      req.body.exercise_name,
      req.body.sets,
      req.body.reps,
      req.body.weight
    );
    res.status(HTTP_CODES.SUCCESS.CREATED).json(workout);
  } catch (error) {
    res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Kunne ikke lagre workout" });
  }
});

export default router;
