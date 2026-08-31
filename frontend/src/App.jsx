import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import CreateSurvey from "./pages/CreateSurvey";
import SurveyForm from "./pages/SurveyForm";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateSurvey />} />
        <Route path="/survey/:id" element={<SurveyForm />} />
        <Route path="/admin/analytics/:id" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;