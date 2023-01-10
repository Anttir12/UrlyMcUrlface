from django.db.models import DateTimeField, Count
from django.db.models.functions import Trunc
from django.http import HttpResponsePermanentRedirect
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from urls import models, serializers

def index(request):
    return render(request, "index.html")


def urly_view(request, slug):
    urly = get_object_or_404(models.Urly, slug=slug)
    models.UrlyVisit.objects.create(urly=urly)
    return HttpResponsePermanentRedirect(urly.url)


class UrlyApiView(generics.CreateAPIView):
    serializer_class = serializers.UrlySerializer


class UrlyVisitsDataView(generics.RetrieveDestroyAPIView):
    serializer_class = serializers.UrlyVisitsDataSerializer

    def get_object(self):
        obj = get_object_or_404(models.Urly, id=self.kwargs["urly_id"])
        return obj

    def retrieve(self, request, *args, **kwargs):
        choices_and_limits = {"year": 10, "month": 60, "week": 52, "day": 180, "hour": 72}
        time_choice = self.request.query_params.get("time_choice", "day")
        urly = self.get_object()
        if time_choice not in choices_and_limits:
            raise ValidationError(f"Unsupported time_choice: {time_choice}")
        limit = choices_and_limits[time_choice]
        time_data = models.UrlyVisit.objects.filter(urly_id=urly.id)\
            .annotate(time=Trunc("visited_at", time_choice, output_field=DateTimeField()))\
            .values("time")\
            .annotate(count=Count("id"))\
            .values("time", "count")\
            .order_by("time")[:limit]  # We want to limit the choices so the chart is somewhat readable
        data = {
            "urly_id": urly.id,
            "slug": urly.slug,
            "data": list(time_data),
        }
        serializer = self.get_serializer(data)
        return Response(data=serializer.data)

