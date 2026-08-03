from django.db import models
from datetime import datetime
from products.models import Product
from users.models import SupplierProfile


class Order(models.Model):

    class Status(models.TextChoices):
        PENDING   = 'pending',   'Pending'
        ACTIVE    = 'active',    'Active'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    product  = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    supplier = models.ForeignKey(
        SupplierProfile,                  # ← references users.SupplierProfile
        on_delete=models.CASCADE,
        related_name='orders',
    )
    quantity = models.IntegerField(default=1)
    address  = models.CharField(max_length=200, default='', blank=True)
    phone    = models.CharField(max_length=20,  default='', blank=True)
    date     = models.DateTimeField(default=datetime.today)
    status   = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'Order #{self.pk} — {self.product.name}'