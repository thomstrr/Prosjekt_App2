class Workout {
    constructor(id, user_id, date, exercise_name, sets, reps, weight) {
        this.id = id;
        this.user_id = user_id;
        this.date = date;
        this.exercise_name = exercise_name;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
    }

    static fromDatabaseRow(row) {
        return new Workout(row.id, row.user_id, row.date, row.exercise_name, row.sets, row.reps, row.weight);
    }
}

export default Workout;