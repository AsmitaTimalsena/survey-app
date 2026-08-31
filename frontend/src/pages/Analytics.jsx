import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Analytics = () => {
  const { id } = useParams();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/surveys/${id}/analytics/`)
      .then((res) => res.json())
      .then(setAnalytics);
  }, [id]);

  if (!analytics) return <p>Loading...</p>;

  const getAnswer = (response, questionId) => {
    return response.answers[questionId];
  };

  return (
    <div className="container">
      <h1>Survey Analytics</h1>

      {/* Total responses */}
      <div className="analytics-summary">
        <h2>Total Responses</h2>
        <div className="response-count">
          {analytics.total_responses}
        </div>
      </div>

      {/* Individual responses */}
      <h2>Individual Responses</h2>

      {analytics.responses.map((response, index) => (
        <div className="response-card" key={response.id}>
          <h3>Response #{analytics.responses.length - index}</h3>

          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(response.submitted_at).toLocaleString()}
          </p>

          {analytics.questions.map((question) => {
            const answer = getAnswer(response, question.id);

            if (answer === undefined) return null;

            return (
              <div className="answer-row" key={question.id}>
                <strong>{question.text}</strong>

                <p>
                  {Array.isArray(answer)
                    ? answer.join(", ")
                    : answer}
                </p>
              </div>
            );
          })}
        </div>
      ))}

            {/* Question Analytics */}
      <h2>Question Analytics</h2>

      {analytics.questions
        .filter(
          (question) =>
            question.type === "single_choice" ||
            question.type === "multiple_choice" ||
            question.type === "rating"
        )
        .map((question) => (
          <div className="analytics-card" key={question.id}>
            <h3>{question.text}</h3>

            {/* Multiple Choice / Checkbox */}
            {(question.type === "single_choice" ||
              question.type === "multiple_choice") &&
              question.counts && (
                <div className="chart-container">
                  <Pie
                    data={{
                      labels: Object.keys(question.counts),
                      datasets: [
                        {
                          data: Object.values(question.counts),
                        },
                      ],
                    }}
                  />
                </div>
              )}

            {/* Rating */}
            {question.type === "rating" && (
              <>
                <h3>
                  Average Rating: {question.average} / 5
                </h3>

                <div className="chart-container">
                  <Bar
                    data={{
                      labels: ["1", "2", "3", "4", "5"],
                      datasets: [
                        {
                          label: "Responses",
                          data: [1, 2, 3, 4, 5].map(
                            (rating) =>
                              question.counts?.[rating] || 0
                          ),
                        },
                      ],
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default Analytics;
