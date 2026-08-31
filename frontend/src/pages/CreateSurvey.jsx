import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSurvey } from "../services/api";
import QuestionEditor from "../components/QuestionEditor";

const CreateSurvey = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    const question = {
      id: crypto.randomUUID(),
      text: "",
      type,
      required: false,
    };

    if (type === "single_choice" || type === "multiple_choice") {
      question.options = ["Option 1", "Option 2"];
    }

    setQuestions([...questions, question]);
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? updatedQuestion : question
      )
    );
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= newQuestions.length) return;

    [newQuestions[index], newQuestions[newIndex]] = [
      newQuestions[newIndex],
      newQuestions[index],
    ];

    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const survey = await createSurvey({
      title,
      description,
      schema: {
        questions,
      },
    });

    navigate(`/survey/${survey.id}`);
  };

  return (
    <div>
      <h1>Create Survey</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Survey title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Survey description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h2>Questions</h2>

        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            total={questions.length}
            previousQuestions={questions.slice(0, index)}
            onUpdate={updateQuestion}
            onRemove={removeQuestion}
            onMove={moveQuestion}
          />
        ))}

        <div>
          <button type="button" onClick={() => addQuestion("text")}>
            + Text
          </button>

          <button
            type="button"
            onClick={() => addQuestion("single_choice")}
          >
            + Multiple Choice
          </button>

          <button
            type="button"
            onClick={() => addQuestion("multiple_choice")}
          >
            + Checkbox
          </button>

          <button type="button" onClick={() => addQuestion("rating")}>
            + Rating
          </button>
        </div>

        <br />

        <button type="submit">Create Survey</button>
      </form>
    </div>
  );
};

export default CreateSurvey;