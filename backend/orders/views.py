from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Order
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer,
    OrderStatusSerializer,
    SupplierChoiceSerializer,
)
from users.models import SupplierProfile
from users.permissions import IsAdmin


# ── Supplier choices (for order form dropdown) ────────────────────────────────

class SupplierListView(generics.ListAPIView):
    """
    GET /orders/suppliers/
    Returns all active supplier profiles for populating the
    supplier dropdown when creating an order.
    """
    serializer_class   = SupplierChoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SupplierProfile.objects.select_related('user').filter(
            user__is_active=True,
            user__role='supplier',
        ).order_by('company_name')


# ── List ──────────────────────────────────────────────────────────────────────

class OrderListView(generics.ListAPIView):
    """
    GET /orders/
    Returns all orders. Supports filtering and search.

    Query params:
      ?status=pending|active|completed|cancelled
      ?supplier=<supplier_profile_id>
      ?product=<product_id>
      ?search=<term>   — searches product name, company name, address
      ?ordering=date|-date|status|quantity
    """
    serializer_class   = OrderListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.OrderingFilter]
    ordering_fields    = ['date', 'status', 'quantity']
    ordering           = ['-date']

    def get_queryset(self):
        qs = Order.objects.select_related(
            'product',
            'supplier',
            'supplier__user',       # ← traverse through SupplierProfile → User
        ).all()

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        supplier_id = self.request.query_params.get('supplier')
        if supplier_id:
            qs = qs.filter(supplier_id=supplier_id)

        product_id = self.request.query_params.get('product')
        if product_id:
            qs = qs.filter(product_id=product_id)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(product__name__icontains=search)          |
                Q(supplier__company_name__icontains=search) |
                Q(address__icontains=search)                |
                Q(phone__icontains=search)
            )

        return qs


# ── Detail ────────────────────────────────────────────────────────────────────

class OrderDetailView(generics.RetrieveAPIView):
    """
    GET /orders/<id>/
    Full order detail including product price, total, and supplier contact info.
    """
    queryset = Order.objects.select_related(
        'product',
        'supplier',
        'supplier__user',
    ).all()
    serializer_class   = OrderDetailSerializer
    permission_classes = [IsAuthenticated]


# ── Create ────────────────────────────────────────────────────────────────────

class OrderCreateView(generics.CreateAPIView):
    """
    POST /orders/create/
    Admin only.

    Body:
      {
        "product":  <product_id>,
        "supplier": <supplier_profile_id>,
        "quantity": <int>,
        "address":  "<string>",   (optional)
        "phone":    "<string>"    (optional)
      }

    Note: 'supplier' is the SupplierProfile id, NOT the User id.
    Use GET /orders/suppliers/ to get the correct ids.
    """
    serializer_class   = OrderCreateSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ── Update ────────────────────────────────────────────────────────────────────

class OrderUpdateView(generics.UpdateAPIView):
    """
    PUT   /orders/<id>/update/  → full update
    PATCH /orders/<id>/update/  → partial update
    Admin only. Can update quantity, address, phone, and status.
    """
    queryset = Order.objects.select_related(
        'product', 'supplier', 'supplier__user'
    ).all()
    serializer_class   = OrderUpdateSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop('partial', False)
        instance   = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── Status-only update ────────────────────────────────────────────────────────

class OrderStatusUpdateView(APIView):
    """
    PATCH /orders/<id>/status/
    Admin only. Updates only the order status.

    Body: { "status": "pending|active|completed|cancelled" }
    """
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        order      = get_object_or_404(Order, pk=pk)
        serializer = OrderStatusSerializer(
            data=request.data,
            context={'order': order},
        )
        serializer.is_valid(raise_exception=True)
        order.status = serializer.validated_data['status']
        order.save(update_fields=['status'])
        return Response({
            'message': f'Order #{order.pk} status updated to "{order.status}".',
            'status':  order.status,
        })


# ── Delete ────────────────────────────────────────────────────────────────────

class OrderDeleteView(generics.DestroyAPIView):
    """
    DELETE /orders/<id>/delete/
    Admin only.
    """
    queryset           = Order.objects.all()
    permission_classes = [IsAdmin]

    def destroy(self, request, *args, **kwargs):
        order        = self.get_object()
        order_id     = order.pk
        product_name = order.product.name
        order.delete()
        return Response(
            {'message': f'Order #{order_id} for "{product_name}" deleted successfully.'},
            status=status.HTTP_200_OK,
        )


# ── Stats (admin dashboard) ───────────────────────────────────────────────────

class OrderStatsView(APIView):
    """
    GET /orders/stats/
    Admin only. Returns counts per status for dashboard cards.
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        orders = Order.objects.all()
        return Response({
            'total':     orders.count(),
            'pending':   orders.filter(status=Order.Status.PENDING).count(),
            'active':    orders.filter(status=Order.Status.ACTIVE).count(),
            'completed': orders.filter(status=Order.Status.COMPLETED).count(),
            'cancelled': orders.filter(status=Order.Status.CANCELLED).count(),
        })