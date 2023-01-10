import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Urly(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    url = models.URLField()
    slug = models.SlugField(max_length=32, unique=True)


class UrlyVisit(models.Model):
    urly = models.ForeignKey(Urly, on_delete=models.CASCADE)
    visited_at = models.DateTimeField(default=timezone.now)
