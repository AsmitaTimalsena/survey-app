import { Form } from "react-bootstrap";

const QuestionRenderer = ({ question, value, onChange }) => {
  switch (question.type) {
    case "text":
      return (
        <Form.Control
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "single_choice":
      return (
        <div>
          {question.options.map((option) => (
            <Form.Check
              key={option}
              type="radio"
              id={`${question.id}-${option}`}
              name={question.id}
              label={option}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="mb-2"
              style={{ fontSize: "1rem" }}
            />
          ))}
        </div>
      );

    case "multiple_choice":
      return (
        <div>
          {question.options.map((option) => {
            const selected = value || [];

            return (
              <Form.Check
                key={option}
                type="checkbox"
                id={`${question.id}-${option}`}
                label={option}
                checked={selected.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, option]);
                  } else {
                    onChange(selected.filter((item) => item !== option));
                  }
                }}
                className="mb-2"
                style={{ fontSize: "1rem" }}
              />
            );
          })}
        </div>
      );

    case "rating":
      return (
        <div style={{ fontSize: "2rem", lineHeight: 1 }}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              onClick={() => onChange(rating)}
              style={{
                cursor: "pointer",
                color: rating <= (value || 0) ? "#e462d5" : "#e0e0e0",
                marginRight: "0.3rem",
                transition: "color 0.15s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                if (rating > (value || 0)) {
                  e.currentTarget.style.color = "#f2b8e8";
                }
              }}
              onMouseLeave={(e) => {
                if (rating > (value || 0)) {
                  e.currentTarget.style.color = "#e0e0e0";
                }
              }}
            >
              ★
            </span>
          ))}

          {value && (
            <span
              style={{
                fontSize: "0.95rem",
                color: "#888",
                marginLeft: "0.5rem",
                verticalAlign: "middle",
              }}
            >
              {value} / 5
            </span>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default QuestionRenderer;