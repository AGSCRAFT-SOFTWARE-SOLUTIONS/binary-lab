import { Quiz } from "../types/types";

export default ({ quiz }: { quiz: Quiz }) => (
  <form
    id={quiz.id}
    class="quiz p-4 rd-xl bg-glass b b-tertiary b-green b-red"
    method="POST"
    action="/quiz/submit"
  >
    <h4>{quiz.question}</h4>
    <fieldset class="grid lg:grid-cols-2 gap-4 p-4">
      {Object.keys(quiz.answers).map((answer, i) => (
        <div class="flex gap-2">
          <input
            type="radio"
            id={quiz.id + i}
            name={quiz.id}
            value={answer}
            required
          />
          <label for={quiz.id + i} class="break-all">
            {answer}
          </label>
        </div>
      ))}
    </fieldset>
    <div class="flex gap-4 items-center">
      <input type="submit" value="Submit" class="glow p-2 rd-xl" />
      <p id={`messageOf${quiz.id}`} class="color-green color-red"></p>
    </div>
  </form>
);
