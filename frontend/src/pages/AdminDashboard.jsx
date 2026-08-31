import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Button, Spinner, Row, Col } from "react-bootstrap";
import { getSurveys } from "../services/api";

const AdminDashboard = () => {
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
      <Container style={{ maxWidth: "800px" }}>
        <h1
          className="text-center mb-4"
          style={{ color: "#e359bf", fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Admin Survey Dashboard
        </h1>

        <Row className="justify-content-center mb-5 g-3">
          <Col xs="auto">
            <Link to="/">
              <Button
                variant="light"
                style={{
                  color: "#6a5af9",
                  fontWeight: 500,
                  borderRadius: "8px",
                  padding: "0.5rem 1.4rem",
                }}
              >
                Public Home
              </Button>
            </Link>
          </Col>

          <Col xs="auto">
            <Link to="/admin/create">
              <Button
                style={{
                  backgroundColor: "#fff",
                  color: "#6a5af9",
                  border: "2px solid #fff",
                  fontWeight: 600,
                  borderRadius: "8px",
                  padding: "0.5rem 1.4rem",
                }}
              >
                + Create Survey
              </Button>
            </Link>
          </Col>
        </Row>

        <h2
          className="mb-4"
          style={{ color: "#df7c7c", fontWeight: 600, fontSize: "1.4rem" }}
        >
          Surveys
        </h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" style={{ color: "#fff" }} />
          </div>
        ) : surveys.length === 0 ? (
          <Card className="text-center p-4 border-0 shadow-sm">
            <Card.Body>
              <p className="mb-0 text-muted">No surveys created yet.</p>
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

                <div className="d-flex gap-2">
                  <Link to={`/survey/${survey.id}`}>
                    <Button
                      style={{
                        backgroundColor: "#6a5af9",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1.2rem",
                        fontWeight: 500,
                      }}
                    >
                      View Survey
                    </Button>
                  </Link>

                  <Link to={`/admin/analytics/${survey.id}`}>
                    <Button
                      variant="outline-secondary"
                      style={{
                        borderRadius: "8px",
                        padding: "0.5rem 1.2rem",
                        fontWeight: 500,
                      }}
                    >
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;