from django.urls import path

from . import views

urlpatterns = [
    path("", views.InvoiceListView.as_view(), name="invoice-list"),
    path("create/", views.InvoiceCreateView.as_view(), name="invoice-create"),
    path("<int:pk>/", views.InvoiceDetailView.as_view(), name="invoice-detail"),
    path("<int:pk>/update/", views.InvoiceDetailView.as_view(), name="invoice-update"),
    path("<int:pk>/delete/", views.InvoiceDetailView.as_view(), name="invoice-delete"),
]
