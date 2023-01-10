from django.urls import path
from urls import views

app_name = "api"

urlpatterns = [
    path('urly', views.UrlyApiView.as_view(), name="urly"),
    path('urly/<str:urly_id>', views.UrlyVisitsDataView.as_view(), name="urly_data")
]