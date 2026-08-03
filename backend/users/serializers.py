from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, CustomerProfile, SupplierProfile


# Profile Serializers 

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CustomerProfile
        fields = ["address"]


class SupplierProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SupplierProfile
        fields = ["company_name", "company_address"]


# Registration Serializers 
class BaseRegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model  = User
        fields = ["first_name", "last_name", "email", "phone", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def _create_user(self, validated_data, role):
        profile_data = self._pop_profile_data(validated_data)
        validated_data["role"] = role
        user = User.objects.create_user(**validated_data)
        self._create_profile(user, profile_data)
        return user

    def _pop_profile_data(self, validated_data):
        return {}

    def _create_profile(self, user, profile_data):
        pass


class CustomerRegisterSerializer(BaseRegisterSerializer):
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta(BaseRegisterSerializer.Meta):
        fields = BaseRegisterSerializer.Meta.fields + ["address"]

    def _pop_profile_data(self, validated_data):
        return {"address": validated_data.pop("address", "")}

    def _create_profile(self, user, profile_data):
        CustomerProfile.objects.create(user=user, **profile_data)

    def create(self, validated_data):
        return self._create_user(validated_data, User.Role.CUSTOMER)


class SupplierRegisterSerializer(BaseRegisterSerializer):
    company_name    = serializers.CharField(max_length=100)
    company_address = serializers.CharField(required=False, allow_blank=True)

    class Meta(BaseRegisterSerializer.Meta):
        fields = BaseRegisterSerializer.Meta.fields + ["company_name", "company_address"]

    def _pop_profile_data(self, validated_data):
        return {
            "company_name":    validated_data.pop("company_name"),
            "company_address": validated_data.pop("company_address", ""),
        }

    def _create_profile(self, user, profile_data):
        SupplierProfile.objects.create(user=user, **profile_data)

    def create(self, validated_data):
        return self._create_user(validated_data, User.Role.SUPPLIER)


class AdminRegisterSerializer(BaseRegisterSerializer):
    def create(self, validated_data):
        return self._create_user(validated_data, User.Role.ADMIN)


# Auth Serializers 

class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account has been deactivated.")
        attrs["user"] = user
        return attrs


# User Detail / Role Management Serializers

class UserDetailSerializer(serializers.ModelSerializer):
    customer_profile = CustomerProfileSerializer(read_only=True)
    supplier_profile = SupplierProfileSerializer(read_only=True)

    class Meta:
        model  = User
        fields = [
            "id", "first_name", "last_name", "email", "phone",
            "role", "is_active", "created_at",
            "customer_profile", "supplier_profile",
        ]
        read_only_fields = ["id", "email", "role", "created_at"]


class RoleChangeSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.Role.choices)

    def validate_role(self, value):
        user = self.context["user"]
        if user.role == value:
            raise serializers.ValidationError(f"User already has the '{value}' role.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password     = serializers.CharField(write_only=True, min_length=8)
    new_password2    = serializers.CharField(write_only=True, label="Confirm new password")

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError({"current_password": "Incorrect password."})
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        return attrs