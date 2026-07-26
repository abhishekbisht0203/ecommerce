from .models import Cart, Wishlist
from django.db.models import Sum

def cart_count(request):
    if request.user.is_authenticated:
        total = Cart.objects.filter(user=request.user).aggregate(total_quantity=Sum('quantity'))['total_quantity']
        return {'cart_count': total or 0}
    return {'cart_count': 0}

# Wishlist count for navbar badge
# No direct import needed; will use Wishlist model

def wishlist_count(request):
    if request.user.is_authenticated:
        total = Wishlist.objects.filter(user=request.user).count()
        return {'wishlist_count': total}
    return {'wishlist_count': 0}
