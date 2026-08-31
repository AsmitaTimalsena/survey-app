const QuestionRenderer = ({ question, value, onChange }) => {
  switch (question.type) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "single_choice":
      return (
        <div>
          {question.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      );

    case "multiple_choice":
      return (
        <div>
          {question.options.map((option) => {
            const selected = value || [];

            return (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selected, option]);
                    } else {
                      onChange(
                        selected.filter((item) => item !== option)
                      );
                    }
                  }}
                />
                {option}
              </label>
            );
          })}
        </div>
      );

    case "rating":
      return (
        <div>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              type="button"
              key={rating}
              onClick={() => onChange(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default QuestionRenderer;