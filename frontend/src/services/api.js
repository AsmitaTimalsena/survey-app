const API_URL = import.meta.env.VITE_API_URL;

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
        answers: answers,
      }),
    }
  );

  const data = await response.json();

  console.log("Response status:", response.status);
  console.log("Response data:", data);

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};