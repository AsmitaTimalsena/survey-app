import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { getSurveys } from "../services/api";

const Home = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSurveys().then((data) => {
      setSurveys(data);
      setLoading(false);
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a5af9 0%, #a190f5 100%)",
        paddingTop: "3rem",
        paddingBottom: "3rem",
      }}
    >
      <Container style={{ maxWidth: "700px" }}>
        <h1
          className="text-center mb-3"
          style={{ color: "#e832b7", fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Surveying You: For a Good Cause
        </h1>

        <p className="text-center mb-5" style={{ color: "#df5674", fontSize: "1.05rem" }}>
          Please choose a survey below to share your response.
        </p>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" style={{ color: "#fff" }} />
          </div>
        ) : surveys.length === 0 ? (
          <Card className="text-center p-4 border-0 shadow-sm">
            <Card.Body>
              <p className="mb-0 text-muted">No surveys available.</p>
            </Card.Body>
          </Card>
        ) : (
          surveys.map((survey) => (
            <Card
              key={survey.id}
              className="mb-4 border-0 shadow-sm"
              style={{ borderRadius: "14px" }}
            >
              <Card.Body className="p-4">
                <Card.Title
                  style={{ color: "#6a5af9", fontWeight: 600, fontSize: "1.3rem" }}
                >
                  {survey.title}
                </Card.Title>

                <Card.Text style={{ color: "#555" }}>
                  {survey.description}
                </Card.Text>

                <Link to={`/survey/${survey.id}`}>
                  <Button
                    style={{
                      backgroundColor: "#6a5af9",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1.4rem",
                      fontWeight: 500,
                    }}
                  >
                    Take Survey
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default Home;