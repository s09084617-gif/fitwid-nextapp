export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "cardio";

export type Equipment =
  | "bodyweight"
  | "dumbbell"
  | "barbell"
  | "machine"
  | "bands"
  | "kettlebell";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  cue: string;
}

export const EXERCISES: Exercise[] = [
  // Chest
  { id: "pushup", name: "Push-Up", muscleGroup: "chest", equipment: "bodyweight", difficulty: "beginner", cue: "Keep core tight, elbows ~45°" },
  { id: "incline-pushup", name: "Incline Push-Up", muscleGroup: "chest", equipment: "bodyweight", difficulty: "beginner", cue: "Hands elevated on bench for easier variant" },
  { id: "db-bench-press", name: "Dumbbell Bench Press", muscleGroup: "chest", equipment: "dumbbell", difficulty: "intermediate", cue: "Control the descent, press up smoothly" },
  { id: "db-flye", name: "Dumbbell Chest Flye", muscleGroup: "chest", equipment: "dumbbell", difficulty: "intermediate", cue: "Slight elbow bend throughout" },
  { id: "barbell-bench-press", name: "Barbell Bench Press", muscleGroup: "chest", equipment: "barbell", difficulty: "advanced", cue: "Retract shoulder blades, feet planted" },
  { id: "chest-press-machine", name: "Chest Press Machine", muscleGroup: "chest", equipment: "machine", difficulty: "beginner", cue: "Adjust seat so handles align with chest" },
  { id: "band-chest-press", name: "Band Chest Press", muscleGroup: "chest", equipment: "bands", difficulty: "beginner", cue: "Anchor band behind you, press forward" },

  // Back
  { id: "bodyweight-row", name: "Inverted Row", muscleGroup: "back", equipment: "bodyweight", difficulty: "intermediate", cue: "Body straight, pull chest to bar" },
  { id: "superman", name: "Superman Hold", muscleGroup: "back", equipment: "bodyweight", difficulty: "beginner", cue: "Lift chest and legs, squeeze glutes" },
  { id: "db-row", name: "Dumbbell Row", muscleGroup: "back", equipment: "dumbbell", difficulty: "beginner", cue: "Flat back, pull elbow past torso" },
  { id: "db-pullover", name: "Dumbbell Pullover", muscleGroup: "back", equipment: "dumbbell", difficulty: "intermediate", cue: "Keep slight elbow bend, feel the stretch" },
  { id: "barbell-row", name: "Barbell Bent-Over Row", muscleGroup: "back", equipment: "barbell", difficulty: "advanced", cue: "Hinge at hips, neutral spine" },
  { id: "lat-pulldown", name: "Lat Pulldown Machine", muscleGroup: "back", equipment: "machine", difficulty: "beginner", cue: "Pull bar to upper chest, control the return" },
  { id: "band-row", name: "Band Seated Row", muscleGroup: "back", equipment: "bands", difficulty: "beginner", cue: "Squeeze shoulder blades at the end" },
  { id: "kb-row", name: "Kettlebell Row", muscleGroup: "back", equipment: "kettlebell", difficulty: "intermediate", cue: "Brace core, pull to hip" },

  // Shoulders
  { id: "pike-pushup", name: "Pike Push-Up", muscleGroup: "shoulders", equipment: "bodyweight", difficulty: "intermediate", cue: "Hips high, head toward floor" },
  { id: "db-shoulder-press", name: "Dumbbell Shoulder Press", muscleGroup: "shoulders", equipment: "dumbbell", difficulty: "beginner", cue: "Press straight up, avoid arching back" },
  { id: "db-lateral-raise", name: "Dumbbell Lateral Raise", muscleGroup: "shoulders", equipment: "dumbbell", difficulty: "beginner", cue: "Slight bend in elbows, lead with elbows" },
  { id: "barbell-ohp", name: "Barbell Overhead Press", muscleGroup: "shoulders", equipment: "barbell", difficulty: "advanced", cue: "Brace core, press bar in straight line" },
  { id: "shoulder-press-machine", name: "Shoulder Press Machine", muscleGroup: "shoulders", equipment: "machine", difficulty: "beginner", cue: "Full range, controlled tempo" },
  { id: "band-lateral-raise", name: "Band Lateral Raise", muscleGroup: "shoulders", equipment: "bands", difficulty: "beginner", cue: "Stand on band, raise to shoulder height" },
  { id: "kb-press", name: "Kettlebell Press", muscleGroup: "shoulders", equipment: "kettlebell", difficulty: "intermediate", cue: "Rack position, drive straight up" },

  // Biceps
  { id: "chinup", name: "Chin-Up", muscleGroup: "biceps", equipment: "bodyweight", difficulty: "advanced", cue: "Underhand grip, chest to bar" },
  { id: "db-curl", name: "Dumbbell Bicep Curl", muscleGroup: "biceps", equipment: "dumbbell", difficulty: "beginner", cue: "Elbows pinned to sides" },
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "biceps", equipment: "barbell", difficulty: "intermediate", cue: "No swinging, controlled tempo" },
  { id: "band-curl", name: "Band Bicep Curl", muscleGroup: "biceps", equipment: "bands", difficulty: "beginner", cue: "Stand on band, curl to shoulder" },
  { id: "kb-curl", name: "Kettlebell Curl", muscleGroup: "biceps", equipment: "kettlebell", difficulty: "beginner", cue: "Neutral grip, slow negative" },

  // Triceps
  { id: "tricep-dip", name: "Bench Tricep Dip", muscleGroup: "triceps", equipment: "bodyweight", difficulty: "intermediate", cue: "Elbows track backward, not out" },
  { id: "diamond-pushup", name: "Diamond Push-Up", muscleGroup: "triceps", equipment: "bodyweight", difficulty: "advanced", cue: "Hands form diamond shape under chest" },
  { id: "db-tricep-extension", name: "Dumbbell Overhead Extension", muscleGroup: "triceps", equipment: "dumbbell", difficulty: "beginner", cue: "Elbows close to head, full stretch" },
  { id: "db-kickback", name: "Dumbbell Kickback", muscleGroup: "triceps", equipment: "dumbbell", difficulty: "beginner", cue: "Upper arm parallel to floor" },
  { id: "tricep-pushdown", name: "Cable/Machine Tricep Pushdown", muscleGroup: "triceps", equipment: "machine", difficulty: "beginner", cue: "Elbows pinned, full extension" },
  { id: "band-pushdown", name: "Band Tricep Pushdown", muscleGroup: "triceps", equipment: "bands", difficulty: "beginner", cue: "Anchor overhead, push down" },

  // Quads
  { id: "bodyweight-squat", name: "Bodyweight Squat", muscleGroup: "quads", equipment: "bodyweight", difficulty: "beginner", cue: "Knees track over toes, chest up" },
  { id: "lunge", name: "Walking Lunge", muscleGroup: "quads", equipment: "bodyweight", difficulty: "beginner", cue: "Front knee at 90°, torso upright" },
  { id: "jump-squat", name: "Jump Squat", muscleGroup: "quads", equipment: "bodyweight", difficulty: "advanced", cue: "Soft landing, full squat depth" },
  { id: "db-goblet-squat", name: "Dumbbell Goblet Squat", muscleGroup: "quads", equipment: "dumbbell", difficulty: "beginner", cue: "Hold weight at chest, sit back and down" },
  { id: "db-lunge", name: "Dumbbell Lunge", muscleGroup: "quads", equipment: "dumbbell", difficulty: "intermediate", cue: "Control the descent" },
  { id: "barbell-squat", name: "Barbell Back Squat", muscleGroup: "quads", equipment: "barbell", difficulty: "advanced", cue: "Bar on upper back, hips and chest rise together" },
  { id: "leg-press", name: "Leg Press Machine", muscleGroup: "quads", equipment: "machine", difficulty: "beginner", cue: "Don't lock out knees at top" },
  { id: "kb-goblet-squat", name: "Kettlebell Goblet Squat", muscleGroup: "quads", equipment: "kettlebell", difficulty: "beginner", cue: "Elbows inside knees at bottom" },
  { id: "band-squat", name: "Band Squat", muscleGroup: "quads", equipment: "bands", difficulty: "beginner", cue: "Band under feet, held at shoulders" },

  // Hamstrings / Glutes
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "glutes", equipment: "bodyweight", difficulty: "beginner", cue: "Squeeze glutes at the top" },
  { id: "single-leg-rdl", name: "Single-Leg RDL (bodyweight)", muscleGroup: "hamstrings", equipment: "bodyweight", difficulty: "intermediate", cue: "Hinge at hips, back flat" },
  { id: "db-rdl", name: "Dumbbell Romanian Deadlift", muscleGroup: "hamstrings", equipment: "dumbbell", difficulty: "intermediate", cue: "Slight knee bend, hinge back" },
  { id: "db-step-up", name: "Dumbbell Step-Up", muscleGroup: "glutes", equipment: "dumbbell", difficulty: "beginner", cue: "Drive through front heel" },
  { id: "barbell-deadlift", name: "Barbell Deadlift", muscleGroup: "hamstrings", equipment: "barbell", difficulty: "advanced", cue: "Neutral spine, push floor away" },
  { id: "hamstring-curl-machine", name: "Hamstring Curl Machine", muscleGroup: "hamstrings", equipment: "machine", difficulty: "beginner", cue: "Controlled curl, no hip lift" },
  { id: "kb-swing", name: "Kettlebell Swing", muscleGroup: "glutes", equipment: "kettlebell", difficulty: "intermediate", cue: "Hinge, snap hips forward" },
  { id: "band-glute-kickback", name: "Band Glute Kickback", muscleGroup: "glutes", equipment: "bands", difficulty: "beginner", cue: "Squeeze glute at full extension" },

  // Calves
  { id: "calf-raise", name: "Standing Calf Raise", muscleGroup: "calves", equipment: "bodyweight", difficulty: "beginner", cue: "Full range, pause at top" },
  { id: "db-calf-raise", name: "Dumbbell Calf Raise", muscleGroup: "calves", equipment: "dumbbell", difficulty: "beginner", cue: "Slow tempo, full stretch at bottom" },
  { id: "calf-raise-machine", name: "Calf Raise Machine", muscleGroup: "calves", equipment: "machine", difficulty: "beginner", cue: "Controlled through full range" },

  // Core
  { id: "plank", name: "Plank", muscleGroup: "core", equipment: "bodyweight", difficulty: "beginner", cue: "Straight line head to heels" },
  { id: "situp", name: "Sit-Up", muscleGroup: "core", equipment: "bodyweight", difficulty: "beginner", cue: "Controlled tempo, avoid neck strain" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "core", equipment: "bodyweight", difficulty: "intermediate", cue: "Rotate from torso, feet may lift" },
  { id: "leg-raise", name: "Hanging/Lying Leg Raise", muscleGroup: "core", equipment: "bodyweight", difficulty: "advanced", cue: "Avoid swinging, control the descent" },
  { id: "mountain-climber", name: "Mountain Climber", muscleGroup: "core", equipment: "bodyweight", difficulty: "beginner", cue: "Keep hips low and stable" },
  { id: "db-woodchopper", name: "Dumbbell Woodchopper", muscleGroup: "core", equipment: "dumbbell", difficulty: "intermediate", cue: "Rotate through torso, not just arms" },
  { id: "cable-crunch", name: "Cable/Machine Crunch", muscleGroup: "core", equipment: "machine", difficulty: "beginner", cue: "Curl spine, not just pull with arms" },
  { id: "band-pallof-press", name: "Band Pallof Press", muscleGroup: "core", equipment: "bands", difficulty: "intermediate", cue: "Resist rotation, press straight out" },
  { id: "kb-halo", name: "Kettlebell Halo", muscleGroup: "core", equipment: "kettlebell", difficulty: "intermediate", cue: "Circle bell around head, stay upright" },

  // Cardio / conditioning
  { id: "jumping-jacks", name: "Jumping Jacks", muscleGroup: "cardio", equipment: "bodyweight", difficulty: "beginner", cue: "Steady rhythm, land soft" },
  { id: "burpee", name: "Burpee", muscleGroup: "cardio", equipment: "bodyweight", difficulty: "advanced", cue: "Full push-up, explosive jump" },
  { id: "high-knees", name: "High Knees", muscleGroup: "cardio", equipment: "bodyweight", difficulty: "beginner", cue: "Drive knees to hip height" },
  { id: "kb-swing-cardio", name: "Kettlebell Swing (conditioning)", muscleGroup: "cardio", equipment: "kettlebell", difficulty: "intermediate", cue: "Continuous hip-hinge rhythm" },
  { id: "shadow-boxing", name: "Shadow Boxing", muscleGroup: "cardio", equipment: "bodyweight", difficulty: "beginner", cue: "Stay light on feet, rotate hips on punches" },
];
