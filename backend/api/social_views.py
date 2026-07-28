from django.shortcuts import redirect
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def login_success(request):
    if not request.user.is_authenticated:
        return redirect(f"{settings.FRONTEND_URL}/login?error=not_authenticated")

    refresh = RefreshToken.for_user(request.user)
    access = str(refresh.access_token)
    refresh_token = str(refresh)

    url = f"{settings.FRONTEND_URL}/auth/callback?access={access}&refresh={refresh_token}"
    return redirect(url)