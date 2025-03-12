import express from "express";
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../data/dataController.mjs";

const router = express.Router();

router.get("/workouts", getAllWorkouts);
router.get("/workouts/:id", getWorkoutById);
router.post("/workouts", createWorkout);
router.put("/workouts/:id", updateWorkout);
router.delete("/workouts/:id", deleteWorkout);

export default router;
