from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .models import WishlistItem
from main.models import Cart
from .serializers import ProductSerializer, WishlistItemSerializer, CartSerializer
from main.models import Products
from django.contrib.auth import login
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount
from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
def current_user(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
    })


@csrf_exempt
def google_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        body = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    credential = body.get('credential')
    if not credential:
        return JsonResponse({'error': 'Credential is required'}, status=400)

    try:
        from django.conf import settings
        google_client_id = settings.SOCIALACCOUNT_PROVIDERS.get('google', {}).get('APP', {}).get('client_id', '')

        if not google_client_id:
            logger.error("GOOGLE_CLIENT_ID is not configured. Set it in Render environment variables.")
            return JsonResponse({'error': 'Google login is not configured on the server'}, status=500)

        id_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id
        )

        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return JsonResponse({'error': 'Invalid issuer'}, status=400)

        email = id_info.get('email')
        google_id = id_info.get('sub')

        if not email:
            return JsonResponse({'error': 'Email not provided by Google'}, status=400)

        social_accounts = SocialAccount.objects.filter(provider='google', uid=google_id)
        if social_accounts.exists():
            user = social_accounts.first().user
        else:
            user_qs = User.objects.filter(email=email)
            if user_qs.exists():
                user = user_qs.first()
                SocialAccount.objects.create(
                    user=user,
                    provider='google',
                    uid=google_id,
                    extra_data=id_info,
                )
            else:
                username = email.split('@')[0]
                base_username = username
                suffix = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{suffix}"
                    suffix += 1

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None,
                )
                SocialAccount.objects.create(
                    user=user,
                    provider='google',
                    uid=google_id,
                    extra_data=id_info,
                )

        login(request, user)
        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            'success': True,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
        })

    except ValueError as e:
        logger.error(f"Google token verification failed: {e}")
        return JsonResponse({'error': 'Invalid Google credential'}, status=400)
    except Exception as e:
        logger.error(f"Google login error: {e}", exc_info=True)
        return JsonResponse({'error': 'Google login failed'}, status=500)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)