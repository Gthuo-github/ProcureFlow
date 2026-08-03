from django.urls import path

from . import views

urlpatterns = [
    path("", views.SupplierListView.as_view(), name="supplier-list"),
]
