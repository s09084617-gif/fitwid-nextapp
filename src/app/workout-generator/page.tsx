import { redirect } from "next/navigation";

export default function WorkoutGeneratorRedirect() {
  redirect("/dashboard/workouts");
}
