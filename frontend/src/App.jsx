import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import CreateSurvey from "./pages/CreateSurvey";
import SurveyForm from "./pages/SurveyForm";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/survey/:id" element={<SurveyForm />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateSurvey />} />
        <Route path="/admin/analytics/:id" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;