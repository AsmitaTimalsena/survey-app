import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import { getSurvey, submitResponse } from "../services/api";
import QuestionRenderer from "../components/QuestionRenderer";

const SurveyForm = () => {
  const { id } = useParams();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const draftKey = `survey_draft_${id}`;

  useEffect(() => {
  getSurvey(id).then((data) => {
    setSurvey(data);

    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      setAnswers(JSON.parse(savedDraft));
    }
  });
}, [id]);
  
  useEffect(() => {
  if (Object.keys(answers).length > 0) {
    localStorage.setItem(draftKey, JSON.stringify(answers));
  }
}, [answers, draftKey]);



  const wrapperStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a5af9 0%, #a190f5 100%)",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  };

  if (!survey) {
    return (
      <div style={wrapperStyle} className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" style={{ color: "#fff" }} />
      </div>
    );
  }

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

localStorage.removeItem(draftKey);

navigate("/");
  };

  return (
    <div style={wrapperStyle}>
      <Container style={{ maxWidth: "700px" }}>
        <h1
          className="text-center mb-2"
          style={{ color: "#e462d5", fontWeight: 700, letterSpacing: "0.5px" }}
        >
          {survey.title}
        </h1>

        <p className="text-center mb-5" style={{ color: "#eb7b8c", fontSize: "1.05rem" }}>
          {survey.description}
        </p>

        <Card className="border-0 shadow-sm" style={{ borderRadius: "14px" }}>
          <Card.Body className="p-4 p-md-3">
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {questions.map((question) => {
                if (!isVisible(question)) return null;

                return (
                  <div key={question.id} className="mb-4">
                    <Form.Label
                      style={{ color: "#333", fontWeight: 600, fontSize: "1.05rem" }}
                    >
                      {question.text}
                      {question.required && (
                        <span style={{ color: "#e74c3c" }}> *</span>
                      )}
                    </Form.Label>

                    <QuestionRenderer
                      question={question}
                      value={answers[question.id]}
                      onChange={(value) => handleChange(question.id, value)}
                    />
                  </div>
                );
              })}

              <div className="text-center mt-5">
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#6a5af9",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.6rem 2.2rem",
                    fontWeight: 600,
                  }}
                >
                  Submit Survey
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SurveyForm;