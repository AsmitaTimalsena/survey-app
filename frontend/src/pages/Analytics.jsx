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
import { Container, Card, Spinner, Row, Col, Badge } from "react-bootstrap";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const CHART_COLORS = [
  "#6a5af9",
  "#e462d5",
  "#eb7b8c",
  "#a190f5",
  "#f2b8e8",
  "#8ecae6",
  "#ffb703",
  "#95d5b2",
];
const API_URL = import.meta.env.VITE_API_URL;

const Analytics = () => {
  const { id } = useParams();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/surveys/${id}/analytics/`)
      .then((res) => res.json())
      .then(setAnalytics);
  }, [id]);

  const wrapperStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a5af9 0%, #a190f5 100%)",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  };

  if (!analytics) {
    return (
      <div style={wrapperStyle} className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" style={{ color: "#fff" }} />
      </div>
    );
  }

  const getAnswer = (response, questionId) => {
    return response.answers[questionId];
  };

  return (
    <div style={wrapperStyle}>
      <Container style={{ maxWidth: "850px" }}>
        <h1
          className="text-center mb-5"
          style={{ color: "#fff", fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Survey Analytics
        </h1>

        {/* Total responses */}
        <Card className="border-0 shadow-sm mb-5 text-center" style={{ borderRadius: "14px" }}>
          <Card.Body className="p-4">
            <h6 style={{ color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
              Total Responses
            </h6>
            <div style={{ color: "#6a5af9", fontWeight: 700, fontSize: "2.8rem" }}>
              {analytics.total_responses}
            </div>
          </Card.Body>
        </Card>

        {/* Question Analytics */}
        <h2 className="mb-4" style={{ color: "#fff", fontWeight: 600, fontSize: "1.4rem" }}>
          Question Analytics
        </h2>

        {analytics.questions
          .filter(
            (question) =>
              question.type === "single_choice" ||
              question.type === "multiple_choice" ||
              question.type === "rating"
          )
          .map((question) => (
            <Card
              className="border-0 shadow-sm mb-4"
              key={question.id}
              style={{ borderRadius: "14px" }}
            >
              <Card.Body className="p-4">
                <Card.Title style={{ color: "#333", fontWeight: 600, fontSize: "1.15rem" }}>
                  {question.text}
                </Card.Title>

                {/* Multiple Choice / Checkbox */}
                {(question.type === "single_choice" ||
                  question.type === "multiple_choice") &&
                  question.counts && (
                    <div style={{ maxWidth: "320px", margin: "1.5rem auto 0" }}>
                      <Pie
                        data={{
                          labels: Object.keys(question.counts),
                          datasets: [
                            {
                              data: Object.values(question.counts),
                              backgroundColor: CHART_COLORS,
                              borderWidth: 0,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: { boxWidth: 12, padding: 12 },
                            },
                          },
                        }}
                      />
                    </div>
                  )}

                {/* Rating */}
                {question.type === "rating" && (
                  <>
                    <div className="mb-3">
                      <Badge
                        style={{
                          backgroundColor: "#e462d5",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          padding: "0.5rem 0.9rem",
                        }}
                      >
                        Average Rating: {question.average} / 5
                      </Badge>
                    </div>

                    <div style={{ maxWidth: "450px", margin: "0 auto" }}>
                      <Bar
                        data={{
                          labels: ["1", "2", "3", "4", "5"],
                          datasets: [
                            {
                              label: "Responses",
                              data: [1, 2, 3, 4, 5].map(
                                (rating) => question.counts?.[rating] || 0
                              ),
                              backgroundColor: "#6a5af9",
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1 } },
                          },
                        }}
                      />
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}

        {/* Individual responses */}
        <h2 className="mb-4 mt-5" style={{ color: "#fff", fontWeight: 600, fontSize: "1.4rem" }}>
          Individual Responses
        </h2>

        {analytics.responses.map((response, index) => (
          <Card
            className="border-0 shadow-sm mb-4"
            key={response.id}
            style={{ borderRadius: "14px" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 style={{ color: "#6a5af9", fontWeight: 600, margin: 0 }}>
                  Response #{analytics.responses.length - index}
                </h5>
                <small style={{ color: "#999" }}>
                  {new Date(response.submitted_at).toLocaleString()}
                </small>
              </div>

              <hr />

              <Row className="g-3">
                {analytics.questions.map((question) => {
                  const answer = getAnswer(response, question.id);

                  if (answer === undefined) return null;

                  return (
                    <Col md={6} key={question.id}>
                      <div style={{ fontWeight: 600, color: "#444", fontSize: "0.9rem" }}>
                        {question.text}
                      </div>
                      <div style={{ color: "#666" }}>
                        {Array.isArray(answer) ? answer.join(", ") : answer}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default Analytics;