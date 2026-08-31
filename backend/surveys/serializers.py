from rest_framework import serializers
from .models import Survey, SurveyResponse


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = [
            "id",
            "title",
            "description",
            "schema",
            "created_at",
            "updated_at",
        ]


class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = [
            "id",
            "survey",
            "answers",
            "submitted_at",
        ]

    def validate(self, data):
        survey = data["survey"]
        answers = data["answers"]

        for question in survey.schema.get("questions", []):
            question_id = question["id"]

            if question.get("required") and question_id not in answers:
                raise serializers.ValidationError(
                    f"{question['text']} is required."
                )

            if question_id not in answers:
                continue

            answer = answers[question_id]
            question_type = question["type"]

            if question_type == "text" and not isinstance(answer, str):
                raise serializers.ValidationError(
                    f"{question['text']} must be text."
                )

            if question_type == "single_choice":
                if answer not in question.get("options", []):
                    raise serializers.ValidationError(
                        f"Invalid option for {question['text']}."
                    )

            if question_type == "multiple_choice":
                if not isinstance(answer, list):
                    raise serializers.ValidationError(
                        f"{question['text']} must contain multiple options."
                    )

                if not all(
                    option in question.get("options", [])
                    for option in answer
                ):
                    raise serializers.ValidationError(
                        f"Invalid option for {question['text']}."
                    )

            if question_type == "rating":
                if answer not in [1, 2, 3, 4, 5]:
                    raise serializers.ValidationError(
                        f"{question['text']} must be between 1 and 5."
                    )

        return data