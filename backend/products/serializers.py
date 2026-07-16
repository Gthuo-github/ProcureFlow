from rest_framework import serializers
from .models import Category, Product


# ─── Category ─────────────────────────────────────────────────────────────────

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model  = Category
        fields = ["id", "name", "product_count"]

    def get_product_count(self, obj):
        return obj.product_set.count()


# ─── Product ───────────────────────────────────────────────────────────────────

class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — avoids expensive nested reads."""
    category_name = serializers.CharField(source="category.name", read_only=True)
    image         = serializers.ImageField(use_url=True, read_only=True)

    class Meta:
        model  = Product
        fields = ["id", "name", "price", "category", "category_name", "image"]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for retrieve, create, and update."""
    category_name = serializers.CharField(source="category.name", read_only=True)
    image         = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model  = Product
        fields = [
            "id", "name", "price", "category", "category_name",
            "description", "image",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_image(self, value):
        max_size_mb = 5
        if value and value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"Image file size must be under {max_size_mb} MB."
            )
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if value and value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPEG, PNG, and WebP images are supported."
            )
        return value


class ProductCreateSerializer(serializers.ModelSerializer):
    """Used for POST — image is required on creation."""
    image = serializers.ImageField()

    class Meta:
        model  = Product
        fields = ["name", "price", "category", "description", "image"]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_image(self, value):
        max_size_mb = 5
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"Image file size must be under {max_size_mb} MB."
            )
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPEG, PNG, and WebP images are supported."
            )
        return value

    def to_representation(self, instance):
        # Return full detail view after create
        return ProductDetailSerializer(instance, context=self.context).data


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Used for PUT/PATCH — image is optional on update."""
    image = serializers.ImageField(required=False)

    class Meta:
        model  = Product
        fields = ["name", "price", "category", "description", "image"]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_image(self, value):
        max_size_mb = 5
        if value and value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f"Image file size must be under {max_size_mb} MB."
            )
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if value and value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPEG, PNG, and WebP images are supported."
            )
        return value

    def to_representation(self, instance):
        return ProductDetailSerializer(instance, context=self.context).data