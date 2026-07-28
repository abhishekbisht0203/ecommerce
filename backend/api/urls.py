from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, WishlistViewSet, CartViewSet, current_user, google_login

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('auth/user/', current_user, name='current_user'),
    path('auth/google/', google_login, name='google_login'),
    path('', include(router.urls)),
]
