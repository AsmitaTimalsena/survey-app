import { Card, Form, Button, Row, Col, InputGroup, Badge } from "react-bootstrap";

const QuestionEditor = ({
  question,
  index,
  total,
  previousQuestions,
  onUpdate,
  onRemove,
  onMove,
}) => {
  const update = (field, value) => {
    onUpdate(question.id, {
      ...question,
      [field]: value,
    });
  };

  const updateOption = (optionIndex, value) => {
    const options = [...question.options];
    options[optionIndex] = value;
    update("options", options);
  };

  const addOption = () => {
    update("options", [
      ...question.options,
      `Option ${question.options.length + 1}`,
    ]);
  };

  const removeOption = (optionIndex) => {
    update(
      "options",
      question.options.filter((_, i) => i !== optionIndex)
    );
  };

  const setConditionQuestion = (questionId) => {
    if (!questionId) {
      const updatedQuestion = { ...question };
      delete updatedQuestion.condition;
      onUpdate(question.id, updatedQuestion);
      return;
    }

    update("condition", {
      question_id: questionId,
      operator: "equals",
      value: "",
    });
  };

  const conditionQuestion = previousQuestions.find(
    (q) => q.id === question.condition?.question_id
  );

  return (
    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#6a5af9", fontWeight: 600, margin: 0 }}>
            Question {index + 1}
          </h5>

          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
            >
              ↑
            </Button>

            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              disabled={index === total - 1}
              onClick={() => onMove(index, 1)}
            >
              ↓
            </Button>

            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={() => onRemove(question.id)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Question text */}
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500, color: "#444" }}>
            Question Text
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your question"
            value={question.text}
            onChange={(e) => update("text", e.target.value)}
            required
          />
        </Form.Group>

        {/* Question type */}
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: 500, color: "#444" }}>
            Question Type
          </Form.Label>
          <Form.Select
            value={question.type}
            onChange={(e) => {
              const type = e.target.value;

              const updatedQuestion = {
                ...question,
                type,
              };

              if (type === "single_choice" || type === "multiple_choice") {
                updatedQuestion.options = question.options || [
                  "Option 1",
                  "Option 2",
                ];
              } else {
                delete updatedQuestion.options;
              }

              onUpdate(question.id, updatedQuestion);
            }}
          >
            <option value="text">Text Input</option>
            <option value="single_choice">Multiple Choice</option>
            <option value="multiple_choice">Checkbox</option>
            <option value="rating">Rating (1–5)</option>
          </Form.Select>
        </Form.Group>

        {/* Options */}
        {(question.type === "single_choice" ||
          question.type === "multiple_choice") && (
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 500, color: "#444" }}>
              Options
            </Form.Label>

            {question.options.map((option, i) => (
              <InputGroup key={i} className="mb-2">
                <Form.Control
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(i, e.target.value)}
                />

                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={() => removeOption(i)}
                >
                  Remove
                </Button>
              </InputGroup>
            ))}

            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              onClick={addOption}
              className="mt-1"
            >
              + Add Option
            </Button>
          </Form.Group>
        )}

        {/* Required */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id={`${question.id}-required`}
            label="Required"
            checked={question.required}
            onChange={(e) => update("required", e.target.checked)}
          />
        </Form.Group>

        {/* Conditional Logic */}
        {previousQuestions.some(
          (q) => q.type === "single_choice" || q.type === "multiple_choice"
        ) && (
          <div
            className="p-3 mb-2"
            style={{ backgroundColor: "#f8f7ff", borderRadius: "10px" }}
          >
            <Badge
              className="mb-2"
              style={{ backgroundColor: "#6a5af9", fontWeight: 500 }}
            >
              Conditional Logic
            </Badge>

            <Row className="g-2">
              <Col md={conditionQuestion ? 6 : 12}>
                <Form.Select
                  value={question.condition?.question_id || ""}
                  onChange={(e) => setConditionQuestion(e.target.value)}
                >
                  <option value="">No condition</option>

                  {previousQuestions
                    .filter(
                      (q) =>
                        q.type === "single_choice" ||
                        q.type === "multiple_choice"
                    )
                    .map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.text || "Untitled question"}
                      </option>
                    ))}
                </Form.Select>
              </Col>

              {/* Condition value */}
              {question.condition?.question_id && conditionQuestion && (
                <Col md={6}>
                  <Form.Select
                    value={question.condition.value}
                    onChange={(e) =>
                      update("condition", {
                        ...question.condition,
                        value: e.target.value,
                      })
                    }
                  >
                    <option value="">Select value</option>

                    {conditionQuestion.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuestionEditor;