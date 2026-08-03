from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import IsAdmin

from .models import Invoice
from .serializers import InvoiceSerializer


class InvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Invoice.objects.select_related(
            "customer", "created_by"
        ).prefetch_related(
            "items__description"
        )
        customer = self.request.query_params.get("customer")
        if customer:
            queryset = queryset.filter(customer_id=customer)
        return queryset.order_by("-date", "-id")


class InvoiceCreateView(generics.CreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdmin]


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.select_related(
        "customer", "created_by"
    ).prefetch_related(
        "items__description"
    )
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdmin]

    def destroy(self, request, *args, **kwargs):
        invoice = self.get_object()
        number = invoice.invoice_number
        self.perform_destroy(invoice)
        return Response(
            {"message": f"Invoice {number} deleted successfully."},
            status=status.HTTP_200_OK,
        )
