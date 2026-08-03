from django.urls import path
from . import views

urlpatterns = [

    # Categories
    path(
        "categories/",
        views.CategoryListCreateView.as_view(),
        name="category-list-create",
    ),
    path(
        "categories/<int:pk>/",
        views.CategoryDetailView.as_view(),
        name="category-detail",
    ),
    path(
        "categories/<int:pk>/products/",
        views.ProductsByCategoryView.as_view(),
        name="category-products",
    ),

    # Products 
    path(
        "",                                     # /products/
        views.ProductListView.as_view(),
        name="product-list",
    ),
    path(
        "create/",                              # /products/create/
        views.ProductCreateView.as_view(),
        name="product-create",
    ),
    path(
        "<int:pk>/",                            # /products/<id>/
        views.ProductDetailView.as_view(),
        name="product-detail",
    ),
    path(
        "<int:pk>/update/",                     # /products/<id>/update/
        views.ProductUpdateView.as_view(),
        name="product-update",
    ),
    path(
        "<int:pk>/delete/",                     # /products/<id>/delete/
        views.ProductDeleteView.as_view(),
        name="product-delete",
    ),
]