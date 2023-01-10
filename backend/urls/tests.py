import datetime

import pytz
from django.test import TestCase
from django.urls import reverse

from urls import models


# Create your tests here.
class TestUrly(TestCase):

    def test_create_urly(self):
        response = self.client.post(reverse("api:urly"), data={"url": "https://google.fi"})
        self.assertEqual(201, response.status_code)
        response_json = response.json()
        self.assertTrue(models.Urly.objects.filter(id=response_json["id"]).exists())
        self.assertEqual("https://google.fi", response_json["url"])

    def test_create_invalid_url(self):
        response = self.client.post(reverse("api:urly"), data={"url": "invalid.fi"})
        self.assertEqual(400, response.status_code)
        self.assertEqual({'url': ['Enter a valid URL.']}, response.json())
        self.assertFalse(models.Urly.objects.exists())

    def test_urly_redirect(self):
        urly = models.Urly.objects.create(url="https://google.fi", slug="slug")
        response = self.client.get(reverse("urly_view", args=[urly.slug]), follow=False)
        self.assertRedirects(response, urly.url, status_code=301, fetch_redirect_response=False)

    def test_urly_stats(self):
        urly = models.Urly.objects.create(url="https://google.fi", slug="slug")
        start_date = datetime.datetime(2022, 2, 2, 0, 15, tzinfo=pytz.UTC)
        for i in range(8):
            created_at = start_date + datetime.timedelta(minutes=15*i)
            models.UrlyVisit.objects.create(urly=urly, visited_at=created_at)
        response = self.client.get(reverse("api:urly_data", args=[urly.id]) + "?time_choice=hour")
        self.assertEqual(200, response.status_code)
        expected_json = {'urly_id': str(urly.id), 'slug': urly.slug, 'data': [
            {'time': '2022-02-02T00:00:00Z', 'count': 3},
            {'time': '2022-02-02T01:00:00Z', 'count': 4},
            {'time': '2022-02-02T02:00:00Z', 'count': 1}
        ]}
        self.assertEqual(expected_json, response.json())

    def test_delete_urly(self):
        urly1 = models.Urly.objects.create(url="https://google.fi", slug="slug1")
        urly2 = models.Urly.objects.create(url="https://google.com", slug="slug2")

        response = self.client.delete(reverse("api:urly_data", args=[urly1.id]))
        self.assertEqual(204, response.status_code)
        self.assertFalse(models.Urly.objects.filter(id=urly1.id).exists())
        self.assertTrue(models.Urly.objects.filter(id=urly2.id).exists())
