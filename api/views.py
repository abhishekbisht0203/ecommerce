from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import WishlistItem, Cart
from .serializers import ProductSerializer, WishlistItemSerializer, CartSerializer
from main.models import Products

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Read‑only endpoints for product listings and detail view."""
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class WishlistViewSet(viewsets.ModelViewSet):
    """CRUD for a user's wishlist. Authenticated users only.

    - ``list`` returns the current user's wishlist items.
    - ``create`` expects ``product_id`` in the payload.
    - ``destroy`` deletes by the WishlistItem ``id``.
    """
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Ensure only the owner can delete their own item
        instance = self.get_object()
        if instance.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class CartViewSet(viewsets.ModelViewSet):
    """Cart API – works like a typical cart endpoint.

    - ``list`` returns all cart items for the logged‑in user.
    - ``create`` adds a product (or increments quantity if it already exists).
    - ``partial_update``/``update`` modifies quantity.
    - ``destroy`` removes an item.
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
