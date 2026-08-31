from collections import Counter

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Survey, SurveyResponse
from .serializers import SurveySerializer, SurveyResponseSerializer


class SurveyListCreateView(generics.ListCreateAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class SurveyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class SurveyResponseCreateView(generics.CreateAPIView):
    serializer_class = SurveyResponseSerializer


class SurveyResponseListView(generics.ListAPIView):
    serializer_class = SurveyResponseSerializer

    def get_queryset(self):
        return SurveyResponse.objects.filter(
            survey_id=self.kwargs["survey_id"]
        )


class SurveyAnalyticsView(APIView):

    def get(self, request, survey_id):
        survey = Survey.objects.get(id=survey_id)
        responses = SurveyResponse.objects.filter(survey=survey)

        analytics = {
            "total_responses": responses.count(),
            "questions": []
        }

        for question in survey.schema.get("questions", []):
            question_id = question["id"]
            values = [
                response.answers.get(question_id)
                for response in responses
                if question_id in response.answers
            ]

            result = {
                "id": question_id,
                "text": question["text"],
                "type": question["type"],
            }

            if question["type"] == "single_choice":
                result["counts"] = dict(Counter(values))

            elif question["type"] == "multiple_choice":
                counts = Counter()

                for value in values:
                    for option in value:
                        counts[option] += 1

                result["counts"] = dict(counts)

            elif question["type"] == "rating":
                if values:
                    result["average"] = round(
                        sum(values) / len(values), 2
                    )
                else:
                    result["average"] = 0

            elif question["type"] == "text":
                result["responses"] = values

            analytics["questions"].append(result)

        return Response(analytics)