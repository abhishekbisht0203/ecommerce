from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import WishlistItem
from main.models import Cart
from .serializers import ProductSerializer, WishlistItemSerializer, CartSerializer
from main.models import Products
from django.contrib.auth import login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from allauth.socialaccount.models import SocialAccount
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_login(request):
    credential = request.data.get('credential')
    if not credential:
        return Response({'error': 'Credential is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        google_client_id = request.data.get('client_id', '')
        if not google_client_id:
            from django.conf import settings
            google_client_id = settings.SOCIALACCOUNT_PROVIDERS.get('google', {}).get('APP', {}).get('client_id', '')

        id_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id
        )

        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return Response({'error': 'Invalid issuer'}, status=status.HTTP_400_BAD_REQUEST)

        email = id_info.get('email')
        google_id = id_info.get('sub')
        name = id_info.get('name', email.split('@')[0])

        if not email:
            return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if social account already exists
        social_accounts = SocialAccount.objects.filter(provider='google', uid=google_id)
        if social_accounts.exists():
            user = social_accounts.first().user
        else:
            # Check if user with this email already exists
            user_qs = User.objects.filter(email=email)
            if user_qs.exists():
                user = user_qs.first()
                # Link the social account
                SocialAccount.objects.create(
                    user=user,
                    provider='google',
                    uid=google_id,
                    extra_data=id_info,
                )
            else:
                # Create new user
                username = email.split('@')[0]
                base_username = username
                suffix = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{suffix}"
                    suffix += 1

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None,  # unusable password
                )
                SocialAccount.objects.create(
                    user=user,
                    provider='google',
                    uid=google_id,
                    extra_data=id_info,
                )

        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'success': True,
            'token': token.key,
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
        })

    except ValueError as e:
        logger.error(f"Google token verification failed: {e}")
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Google login error: {e}", exc_info=True)
        return Response({'error': 'Google login failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
