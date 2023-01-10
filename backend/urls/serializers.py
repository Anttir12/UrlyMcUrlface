import string
import random

from rest_framework import serializers

from urls import models


class UrlySerializer(serializers.ModelSerializer):

    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = models.Urly
        fields = ("id", "created_at", "url", "slug")
        read_only_field = ("id",  "created_at", "slug")
        
    def save(self):
        slug = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(6))
        super().save(slug=slug)


class UrlyVisitsDataPoint(serializers.BaseSerializer):

    time = serializers.DateTimeField()
    count = serializers.IntegerField()

    def to_representation(self, instance):
        return {
            "time": instance["time"],
            "count": instance["count"],
        }


class UrlyVisitsDataSerializer(serializers.Serializer):
    urly_id = serializers.UUIDField()
    slug = serializers.SlugField()
    data = UrlyVisitsDataPoint(many=True)

    class Meta:
        read_only_fields = ("urly_id", "slug", "data")
        fields = read_only_fields

