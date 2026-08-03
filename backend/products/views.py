from rest_framework import generics, filters, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
)

# Import role permissions from the user/auth app
# Adjust the import path to match your project structure
from users.permissions import IsAdmin, IsAdminOrReadOnly


# Category Views

class CategoryListCreateView(generics.ListCreateAPIView):
    """
    GET  /categories/   → list all categories (any authenticated user)
    POST /categories/   → create a category (admin only)
    """
    queryset           = Category.objects.all().order_by("name")
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /categories/<id>/  → retrieve category
    PUT    /categories/<id>/  → update category (admin only)
    PATCH  /categories/<id>/  → partial update (admin only)
    DELETE /categories/<id>/  → delete category (admin only)
    """
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


# Product Views

class ProductListView(generics.ListAPIView):
    """
    GET /products/
    All authenticated users can list products.

    Filtering:
      ?category=<id>         filter by category
      ?search=<term>         search name and description
      ?min_price=<num>       floor price filter
      ?max_price=<num>       ceiling price filter
      ?ordering=price        sort by price ascending
      ?ordering=-price       sort by price descending
      ?ordering=name         sort by name
    """
    serializer_class   = ProductListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.OrderingFilter]
    ordering_fields    = ["name", "price"]
    ordering           = ["name"]

    def get_queryset(self):
        qs = Product.objects.select_related("category").all()

        # Category filter
        category_id = self.request.query_params.get("category")
        if category_id:
            qs = qs.filter(category_id=category_id)

        # Search across name and description
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        # Price range filter
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)

        return qs


class ProductDetailView(generics.RetrieveAPIView):
    """
    GET /products/<id>/
    Any authenticated user can retrieve a single product.
    """
    queryset           = Product.objects.select_related("category").all()
    serializer_class   = ProductDetailSerializer
    permission_classes = [IsAuthenticated]


class ProductCreateView(generics.CreateAPIView):
    """
    POST /products/create/
    Admin only. Accepts multipart/form-data for image upload.
    """
    serializer_class   = ProductCreateSerializer
    permission_classes = [IsAdmin]
    parser_classes     = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductUpdateView(generics.UpdateAPIView):
    """
    PUT   /products/<id>/update/  → full update (admin only)
    PATCH /products/<id>/update/  → partial update (admin only)
    Accepts multipart/form-data so the image can be replaced.
    """
    queryset           = Product.objects.all()
    serializer_class   = ProductUpdateSerializer
    permission_classes = [IsAdmin]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Remove the old image file from disk when a new one is uploaded
        if "image" in request.data and instance.image:
            instance.image.delete(save=False)

        serializer.save()
        return Response(serializer.data)


class ProductDeleteView(generics.DestroyAPIView):
    """
    DELETE /products/<id>/delete/
    Admin only. Also removes the image file from storage.
    """
    queryset           = Product.objects.all()
    permission_classes = [IsAdmin]

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        # Delete the image file from disk before removing the record
        if product.image:
            product.image.delete(save=False)
        product.delete()
        return Response(
            {"message": f"Product '{product.name}' deleted successfully."},
            status=status.HTTP_200_OK,
        )


class ProductsByCategoryView(generics.ListAPIView):
    """
    GET /categories/<id>/products/
    List all products under a specific category.
    """
    serializer_class   = ProductListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        get_object_or_404(Category, pk=self.kwargs["pk"])   # 404 if category missing
        return (
            Product.objects
            .select_related("category")
            .filter(category_id=self.kwargs["pk"])
            .order_by("name")
        )