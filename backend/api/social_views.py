from urllib.parse import urlencode
from django.shortcuts import redirect
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def login_success(request):
    if not request.user.is_authenticated:
        params = urlencode({'error': 'not_authenticated'})
        return redirect(f"{settings.FRONTEND_URL}/login?{params}")

    refresh = RefreshToken.for_user(request.user)
    access = str(refresh.access_token)
    refresh_token = str(refresh)

    params = urlencode({
        'access': access,
        'refresh': refresh_token,
    })
    return redirect(f"{settings.FRONTEND_URL}/auth/callback?{params}")