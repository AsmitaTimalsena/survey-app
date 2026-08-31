import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a5af9 0%, #a190f5 100%)",
        paddingTop: "3rem",
        paddingBottom: "3rem",
      }}
    >
      <Container style={{ maxWidth: "750px" }}>
        <h1
          className="text-center mb-5"
          style={{ color: "#e462d5", fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Create Survey
        </h1>

        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "14px" }}>
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#333", fontWeight: 600 }}>
                  Survey Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Customer Feedback Survey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#333", fontWeight: 600 }}>
                  Survey Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Briefly describe what this survey is about"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <hr className="my-4" />

              <h2
                className="mb-3"
                style={{ color: "#6a5af9", fontWeight: 600, fontSize: "1.3rem" }}
              >
                Questions
              </h2>

              {questions.length === 0 && (
                <p className="text-muted mb-4">
                  No questions yet. Add one below to get started.
                </p>
              )}

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

              <Row className="g-2 mt-2 mb-4">
                <Col xs="auto">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => addQuestion("text")}
                    style={{ borderRadius: "8px", fontWeight: 500 }}
                  >
                    + Text
                  </Button>
                </Col>

                <Col xs="auto">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => addQuestion("single_choice")}
                    style={{ borderRadius: "8px", fontWeight: 500 }}
                  >
                    + Multiple Choice
                  </Button>
                </Col>

                <Col xs="auto">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => addQuestion("multiple_choice")}
                    style={{ borderRadius: "8px", fontWeight: 500 }}
                  >
                    + Checkbox
                  </Button>
                </Col>

                <Col xs="auto">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => addQuestion("rating")}
                    style={{ borderRadius: "8px", fontWeight: 500 }}
                  >
                    + Rating
                  </Button>
                </Col>
              </Row>

              <div className="text-center">
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
                  Create Survey
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CreateSurvey;