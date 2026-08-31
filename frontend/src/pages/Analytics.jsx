import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Analytics = () => {
  const { id } = useParams();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/surveys/${id}/analytics/`)
      .then((res) => res.json())
      .then(setAnalytics);
  }, [id]);

  if (!analytics) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Survey Analytics</h1>

      <h2>Total Responses: {analytics.total_responses}</h2>

      {analytics.questions.map((question) => (
        <div key={question.id}>
          <h3>{question.text}</h3>

          {question.type === "single_choice" ||
          question.type === "multiple_choice" ? (
            <ul>
              {Object.entries(question.counts).map(
                ([option, count]) => (
                  <li key={option}>
                    {option}: {count}
                  </li>
                )
              )}
            </ul>
          ) : null}

          {question.type === "rating" && (
            <p>Average Rating: {question.average} / 5</p>
          )}

          {question.type === "text" && (
            <ul>
              {question.responses.map((response, index) => (
                <li key={index}>{response}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Analytics;