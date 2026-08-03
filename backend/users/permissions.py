from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Allow access only to admin users."""
    message = "You must be an admin to perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)


class IsAdminOrSelf(BasePermission):
    """Allow admins full access; allow regular users to access only their own data."""
    message = "You do not have permission to access this resource."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin or obj == request.user


class IsCustomer(BasePermission):
    """Allow access only to customer users."""
    message = "You must be a customer to perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_customer)


class IsSupplier(BasePermission):
    """Allow access only to supplier users."""
    message = "You must be a supplier to perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_supplier)


class IsAdminOrReadOnly(BasePermission):
    """Allow read access to all authenticated users; write access only to admins."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_admin