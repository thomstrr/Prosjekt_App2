import express from "express";
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../data/dataController.mjs";

const router = express.Router();

console.log("dataRoutes.mjs loaded");


router.get("/workouts", getAllWorkouts);
router.get("/workouts/:id", getWorkoutById);
router.post("/workouts", createWorkout);
router.put("/workouts/:id", updateWorkout);
router.delete("/workouts/:id", deleteWorkout);


console.log("Registrerte ruter i dataRoutes:");
router.stack.forEach((route) => {
  if (route.route) {
    console.log(`Method: ${Object.keys(route.route.methods)[0].toUpperCase()} - Path: ${route.route.path}`);
  }
});

export default router;
