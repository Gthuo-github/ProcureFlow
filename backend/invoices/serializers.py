from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from .models import Invoice, InvoiceItem


class InvoiceItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="description.name", read_only=True)

    class Meta:
        model = InvoiceItem
        fields = ["id", "description", "product_name", "quantity", "unit_price"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value

    def validate_unit_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Unit price cannot be negative.")
        return value


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    items = InvoiceItemSerializer(many=True, required=False)

    class Meta:
        model = Invoice
        fields = [
            "id", "invoice_number", "invoice_amount", "customer", "customer_name",
            "created_by", "date", "due_date", "items",
        ]
        read_only_fields = ["created_by", "date"]

    def get_customer_name(self, obj):
        if not obj.customer:
            return None
        return obj.customer.get_full_name() or obj.customer.email

    def validate_invoice_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Invoice amount cannot be negative.")
        return value

    def validate(self, attrs):
        items = attrs.get("items")
        supplied_total = attrs.get("invoice_amount")
        if items is not None:
            total = sum(
                (item["quantity"] * item["unit_price"] for item in items), Decimal(0)
            )
            if supplied_total is not None and supplied_total != total:
                raise serializers.ValidationError(
                    {"invoice_amount": "Must equal the total of invoice items."}
                )
            attrs["invoice_amount"] = total
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items", [])
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        invoice = Invoice.objects.create(**validated_data)
        InvoiceItem.objects.bulk_create(
            [InvoiceItem(invoice=invoice, **item) for item in items]
        )
        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)
        instance.save()
        if items is not None:
            instance.items.all().delete()
            InvoiceItem.objects.bulk_create(
                [InvoiceItem(invoice=instance, **item) for item in items]
            )
        return instance
