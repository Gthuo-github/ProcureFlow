from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ActivateUserView,
    AdminRegisterView,
    ChangePasswordView,
    CustomerRegisterView,
    DeactivateUserView,
    LoginView,
    LogoutView,
    MeView,
    RoleChangeView,
    SupplierRegisterView,
    UserDetailView,
    UserListView,
)

urlpatterns = [
    # Registration 
    path("auth/register/customer/", CustomerRegisterView.as_view(), name="register-customer"),
    path("auth/register/supplier/", SupplierRegisterView.as_view(), name="register-supplier"),
    path("auth/register/admin/",    AdminRegisterView.as_view(),    name="register-admin"),

    # Authentication 
    path("auth/login/",             LoginView.as_view(),            name="login"),
    path("auth/logout/",            LogoutView.as_view(),           name="logout"),
    path("auth/token/refresh/",     TokenRefreshView.as_view(),     name="token-refresh"),
    path("auth/password/change/",   ChangePasswordView.as_view(),   name="change-password"),

    # Current user profile
    path("users/me/",               MeView.as_view(),               name="user-me"),

    # Admin: user management
    path("users/",                  UserListView.as_view(),         name="user-list"),
    path("users/<int:pk>/",         UserDetailView.as_view(),       name="user-detail"),
    path("users/<int:pk>/role/",    RoleChangeView.as_view(),       name="user-role-change"),
    path("users/<int:pk>/deactivate/", DeactivateUserView.as_view(), name="user-deactivate"),
    path("users/<int:pk>/activate/",   ActivateUserView.as_view(),   name="user-activate"),
]