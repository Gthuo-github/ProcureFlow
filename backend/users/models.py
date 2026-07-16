from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN    = "admin",    "Admin"
        CUSTOMER = "customer", "Customer"
        SUPPLIER = "supplier", "Supplier"

    first_name = models.CharField(max_length=50)
    last_name  = models.CharField(max_length=50)
    email      = models.EmailField(max_length=100, unique=True)
    phone      = models.CharField(max_length=20, blank=True)
    role       = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)

    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_customer(self):
        return self.role == self.Role.CUSTOMER

    @property
    def is_supplier(self):
        return self.role == self.Role.SUPPLIER


class CustomerProfile(models.Model):
    user    = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile")
    address = models.CharField(max_length=250, blank=True, default="")

    def __str__(self):
        return f"Customer: {self.user.full_name}"


class SupplierProfile(models.Model):
    user            = models.OneToOneField(User, on_delete=models.CASCADE, related_name="supplier_profile")
    company_name    = models.CharField(max_length=100)
    company_address = models.CharField(max_length=250, blank=True, default="")

    def __str__(self):
        return f"Supplier: {self.company_name}"