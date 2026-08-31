import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSurvey, submitResponse } from "../services/api";
import QuestionRenderer from "../components/QuestionRenderer";

const SurveyForm = () => {
  const { id } = useParams();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getSurvey(id).then(setSurvey);
  }, [id]);

  if (!survey) return <p>Loading...</p>;

  const questions = survey.schema.questions;

  const isVisible = (question) => {
    if (!question.condition) return true;

    const answer = answers[question.condition.question_id];

    return answer === question.condition.value;
  };

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (const question of questions) {
      if (!isVisible(question)) continue;

      const answer = answers[question.id];

      if (
        question.required &&
        (answer === undefined ||
          answer === "" ||
          (Array.isArray(answer) && answer.length === 0))
      ) {
        setError(`"${question.text}" is required.`);
        return;
      }
    }

    await submitResponse(id, answers);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        <h1>Thank you!</h1>
        <p>Your response has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{survey.title}</h1>
      <p>{survey.description}</p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        {questions.map((question) => {
          if (!isVisible(question)) return null;

          return (
            <div key={question.id}>
              <h3>
                {question.text}
                {question.required && " *"}
              </h3>

              <QuestionRenderer
                question={question}
                value={answers[question.id]}
                onChange={(value) =>
                  handleChange(question.id, value)
                }
              />
            </div>
          );
        })}

        <button type="submit">Submit Survey</button>
      </form>
    </div>
  );
};

export default SurveyForm;