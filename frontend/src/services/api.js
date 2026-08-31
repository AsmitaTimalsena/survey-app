const API_URL = "http://127.0.0.1:8000/api";

export const getSurveys = async () => {
  const response = await fetch(`${API_URL}/surveys/`);
  return response.json();
};

export const getSurvey = async (id) => {
  const response = await fetch(`${API_URL}/surveys/${id}/`);
  return response.json();
};

export const createSurvey = async (survey) => {
  const response = await fetch(`${API_URL}/surveys/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(survey),
  });

  return response.json();
};

export const submitResponse = async (surveyId, answers) => {
  const response = await fetch(
    `${API_URL}/surveys/${surveyId}/responses/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        survey: surveyId,
        answers,
      }),
    }
  );

  return response.json();
};