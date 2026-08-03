from django.contrib.auth import login, logout
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .permissions import IsAdmin, IsAdminOrSelf
from .serializers import (
    AdminRegisterSerializer,
    ChangePasswordSerializer,
    CustomerRegisterSerializer,
    LoginSerializer,
    RoleChangeSerializer,
    SupplierRegisterSerializer,
    UserDetailSerializer,
)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


# ─── Registration Views ───────────────────────────────────────────────────────

class CustomerRegisterView(generics.CreateAPIView):
    """Public endpoint — anyone can register as a customer."""
    serializer_class = CustomerRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "Customer account created.", "tokens": get_tokens(user)},
            status=status.HTTP_201_CREATED,
        )


class SupplierRegisterView(generics.CreateAPIView):
    """Public endpoint — anyone can register as a supplier."""
    serializer_class = SupplierRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "Supplier account created.", "tokens": get_tokens(user)},
            status=status.HTTP_201_CREATED,
        )


class AdminRegisterView(generics.CreateAPIView):
    """Admin-only — create new admin accounts."""
    serializer_class = AdminRegisterSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "Admin account created.", "user_id": user.id},
            status=status.HTTP_201_CREATED,
        )


# ─── Authentication Views ────────────────────────────────────────────────────

class LoginView(APIView):
    """Authenticate any user and return JWT tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return Response(
            {
                "message": "Login successful.",
                "role": user.role,
                "tokens": get_tokens(user),
            }
        )


class LogoutView(APIView):
    """Blacklist the refresh token to log the user out."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """Authenticated user changes their own password."""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"message": "Password updated successfully."})


# ─── User Profile Views ──────────────────────────────────────────────────────

class MeView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the currently authenticated user's own profile."""
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """Admin-only — list all users, with optional role filtering."""
    serializer_class = UserDetailSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = User.objects.select_related(
            "customer_profile", "supplier_profile"
        ).order_by("-created_at")
        role = self.request.query_params.get("role")
        if role:
            qs = qs.filter(role=role)
        return qs


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin can view/edit/delete any user.
    A user can view/edit only their own account.
    """
    serializer_class = UserDetailSerializer
    permission_classes = [IsAdminOrSelf]
    queryset = User.objects.select_related("customer_profile", "supplier_profile")


# ─── Role Management Views ───────────────────────────────────────────────────

class RoleChangeView(APIView):
    """Admin-only — change the role of any user."""
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = RoleChangeSerializer(data=request.data, context={"user": user})
        serializer.is_valid(raise_exception=True)
        user.role = serializer.validated_data["role"]
        user.save(update_fields=["role"])
        return Response(
            {"message": f"Role updated to '{user.role}'.", "user_id": user.id}
        )


class DeactivateUserView(APIView):
    """Admin-only — deactivate (soft-delete) a user account."""
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user == request.user:
            return Response(
                {"error": "You cannot deactivate your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = False
        user.save(update_fields=["is_active"])
        return Response({"message": f"User '{user.full_name}' has been deactivated."})


class ActivateUserView(APIView):
    """Admin-only — re-activate a deactivated user account."""
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = True
        user.save(update_fields=["is_active"])
        return Response({"message": f"User '{user.full_name}' has been activated."})