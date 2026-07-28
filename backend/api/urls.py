from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import ProductViewSet, WishlistViewSet, CartViewSet, current_user, google_login
from .social_views import login_success

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('auth/user/', current_user, name='current_user'),
    path('auth/google/', google_login, name='google_login'),
    path('auth/login/success/', login_success, name='login_success'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('', include(router.urls)),
]