from django.urls import path
from .views import (
    SurveyListCreateView,
    SurveyDetailView,
    SurveyResponseCreateView,
    SurveyResponseListView,
    SurveyAnalyticsView,
)

urlpatterns = [
    path("surveys/", SurveyListCreateView.as_view()),
    path("surveys/<uuid:pk>/", SurveyDetailView.as_view()),

    path(
        "surveys/<uuid:survey_id>/responses/",
        SurveyResponseCreateView.as_view()
    ),

    path(
        "surveys/<uuid:survey_id>/responses/all/",
        SurveyResponseListView.as_view()
    ),
    path(
    "surveys/<uuid:survey_id>/analytics/",
    SurveyAnalyticsView.as_view()
),
]