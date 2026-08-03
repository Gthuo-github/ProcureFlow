from rest_framework import generics
from users.permissions import IsAdminOrReadOnly

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierListView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all().order_by("company_name")
    serializer_class = SupplierSerializer
    permission_classes = [IsAdminOrReadOnly]
