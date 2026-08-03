from rest_framework import serializers
from .models import Order
from products.models import Product
from users.models import SupplierProfile


# ── Read serializers ──────────────────────────────────────────────────────────

class OrderListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    product_name   = serializers.CharField(source='product.name',               read_only=True)
    product_image  = serializers.ImageField(source='product.image',             read_only=True, use_url=True)
    product_price  = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price    = serializers.SerializerMethodField()
    supplier_name  = serializers.CharField(source='supplier.company_name',      read_only=True)
    supplier_email = serializers.EmailField(source='supplier.user.email',       read_only=True)
    status_display = serializers.CharField(source='get_status_display',         read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id',
            'product', 'product_name', 'product_image', 'product_price', 'total_price',
            'supplier', 'supplier_name', 'supplier_email',
            'quantity', 'address', 'phone',
            'date', 'status', 'status_display',
        ]

    def get_total_price(self, obj):
        return round(obj.quantity * obj.product.price, 2)


class OrderDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nested product and supplier detail."""
    product_name     = serializers.CharField(source='product.name',             read_only=True)
    product_image    = serializers.ImageField(source='product.image',           read_only=True, use_url=True)
    product_price    = serializers.DecimalField(
        source='product.price', max_digits=10, decimal_places=2,               read_only=True
    )
    # Supplier info pulled from SupplierProfile → user
    supplier_name    = serializers.CharField(source='supplier.company_name',    read_only=True)
    supplier_address = serializers.CharField(source='supplier.company_address', read_only=True)
    supplier_email   = serializers.EmailField(source='supplier.user.email',     read_only=True)
    supplier_phone   = serializers.CharField(source='supplier.user.phone',      read_only=True)
    status_display   = serializers.CharField(source='get_status_display',       read_only=True)
    total_price      = serializers.SerializerMethodField()

    class Meta:
        model  = Order
        fields = [
            'id',
            'product', 'product_name', 'product_image', 'product_price',
            'supplier', 'supplier_name', 'supplier_address',
            'supplier_email', 'supplier_phone',
            'quantity', 'address', 'phone',
            'date', 'status', 'status_display',
            'total_price',
        ]

    def get_total_price(self, obj):
        return round(obj.quantity * obj.product.price, 2)


# ── Write serializers ─────────────────────────────────────────────────────────

class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Used for POST — creates a new order.
    'supplier' accepts a SupplierProfile id.
    Only users with role=supplier have a SupplierProfile,
    so this effectively restricts the FK to supplier users.
    """

    class Meta:
        model  = Order
        fields = ['product', 'supplier', 'quantity', 'address', 'phone']

    def validate_supplier(self, value):
        # value is already a SupplierProfile instance (DRF resolves the PK)
        # Confirm the linked user is still active and has supplier role
        if not value.user.is_active:
            raise serializers.ValidationError('This supplier account is inactive.')
        if not value.user.is_supplier:
            raise serializers.ValidationError('The selected user is not a supplier.')
        return value

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be at least 1.')
        return value

    def validate(self, attrs):
        if not Product.objects.filter(pk=attrs['product'].pk).exists():
            raise serializers.ValidationError({'product': 'Product not found.'})
        if not SupplierProfile.objects.filter(pk=attrs['supplier'].pk).exists():
            raise serializers.ValidationError({'supplier': 'Supplier not found.'})
        return attrs

    def to_representation(self, instance):
        return OrderDetailSerializer(instance, context=self.context).data


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Used for PATCH — allows updating quantity, address, phone, and status."""

    class Meta:
        model  = Order
        fields = ['quantity', 'address', 'phone', 'status']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be at least 1.')
        return value

    def validate_status(self, value):
        valid = [s[0] for s in Order.Status.choices]
        if value not in valid:
            raise serializers.ValidationError(
                f"Invalid status. Choose from: {', '.join(valid)}."
            )
        return value

    def to_representation(self, instance):
        return OrderDetailSerializer(instance, context=self.context).data


class OrderStatusSerializer(serializers.Serializer):
    """Lightweight serializer for status-only updates."""
    status = serializers.ChoiceField(choices=Order.Status.choices)

    def validate_status(self, value):
        order = self.context.get('order')
        if order and order.status == value:
            raise serializers.ValidationError(f'Order is already "{value}".')
        return value


# ── Supplier list serializer (for order creation form) ────────────────────────

class SupplierChoiceSerializer(serializers.ModelSerializer):
    """
    Returns available suppliers to populate the supplier dropdown
    when creating an order.
    GET /orders/suppliers/
    """
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email     = serializers.EmailField(source='user.email',    read_only=True)
    phone     = serializers.CharField(source='user.phone',     read_only=True)

    class Meta:
        model  = SupplierProfile
        fields = ['id', 'company_name', 'company_address', 'full_name', 'email', 'phone']