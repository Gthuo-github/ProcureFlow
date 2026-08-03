from django.db import models
from products.models import Product
from users.models import User


class Invoice(models.Model):
    invoice_number = models.CharField(max_length=30)
    invoice_amount = models.DecimalField(default=0, decimal_places=2, max_digits=6)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="created_invoices",
        null=True,
        blank=True,
    )
    customer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="customer_invoices",
        null=True,
        blank=True,
    )
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Invoice {self.invoice_number}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    description = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(default=0, decimal_places=2, max_digits=6)

    def __str__(self):
        return f"{self.description} ({self.quantity} x {self.unit_price})"
