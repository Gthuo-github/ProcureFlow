from django.urls import path
from . import views

urlpatterns = [

    # ── Suppliers list (for order form dropdown) ──────────────────
    path(
        'suppliers/',
        views.SupplierListView.as_view(),
        name='order-supplier-list',
    ),

    # ── List & stats ──────────────────────────────────────────────
    path(
        '',
        views.OrderListView.as_view(),
        name='order-list',
    ),
    path(
        'stats/',
        views.OrderStatsView.as_view(),
        name='order-stats',
    ),

    # ── Create ────────────────────────────────────────────────────
    path(
        'create/',
        views.OrderCreateView.as_view(),
        name='order-create',
    ),

    # ── Detail ────────────────────────────────────────────────────
    path(
        '<int:pk>/',
        views.OrderDetailView.as_view(),
        name='order-detail',
    ),

    # ── Update ────────────────────────────────────────────────────
    path(
        '<int:pk>/update/',
        views.OrderUpdateView.as_view(),
        name='order-update',
    ),
    path(
        '<int:pk>/status/',
        views.OrderStatusUpdateView.as_view(),
        name='order-status',
    ),

    # ── Delete ────────────────────────────────────────────────────
    path(
        '<int:pk>/delete/',
        views.OrderDeleteView.as_view(),
        name='order-delete',
    ),
]