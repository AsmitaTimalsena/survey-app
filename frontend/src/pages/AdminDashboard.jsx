import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSurveys } from "../services/api";

const AdminDashboard = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    getSurveys().then(setSurveys);
  }, []);

  return (
    <div className="container">
      <h1>Survey Dashboard</h1>

      <Link to="/admin/create">
        <button>Create Survey</button>
      </Link>

      <h2>Your Surveys</h2>

      {surveys.map((survey) => (
        <div key={survey.id}>
          <h3>{survey.title}</h3>

          <p>{survey.description}</p>

          <Link to={`/survey/${survey.id}`}>
            View Survey
          </Link>

          {" | "}

          <Link to={`/admin/analytics/${survey.id}`}>
            Analytics
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;