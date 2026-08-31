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
    <div className="question-editor">
      <h3>Question {index + 1}</h3>

      {/* Question text */}
      <input
        type="text"
        placeholder="Question text"
        value={question.text}
        onChange={(e) => update("text", e.target.value)}
        required
      />

      {/* Question type */}
      <select
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
      </select>

      {/* Options */}
      {(question.type === "single_choice" ||
        question.type === "multiple_choice") && (
        <div>
          <h4>Options</h4>

          {question.options.map((option, i) => (
            <div key={i}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(i, e.target.value)}
              />

              <button
                type="button"
                onClick={() => removeOption(i)}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addOption}>
            + Add Option
          </button>
        </div>
      )}

      {/* Required */}
      <label>
        <input
          type="checkbox"
          checked={question.required}
          onChange={(e) => update("required", e.target.checked)}
        />
        Required
      </label>

      {/* Conditional Logic */}
      {/* Conditional Logic */}
{previousQuestions.some(
  (q) =>
    q.type === "single_choice" ||
    q.type === "multiple_choice"
) && (
  <div>
    <h4>Conditional Logic</h4>

    <select
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
    </select>

    {/* Condition value */}
    {question.condition?.question_id &&
      conditionQuestion && (
        <select
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
        </select>
      )}
  </div>
)}

      {/* Reorder / Delete */}
      <div>
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, -1)}
        >
          ↑
        </button>

        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, 1)}
        >
          ↓
        </button>

        <button
          type="button"
          onClick={() => onRemove(question.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;