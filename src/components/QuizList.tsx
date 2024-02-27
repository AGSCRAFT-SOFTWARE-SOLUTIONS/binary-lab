import { Quiz } from "../types/types";
import QuizCard from "./QuizCard";

export default ({ quizzes }: { quizzes?: Quiz[] }) => (
  <div id="quizCards" class="grid gap-4 h-min">
    {quizzes?.map((quiz) => <QuizCard quiz={quiz} />)}
  </div>
);
