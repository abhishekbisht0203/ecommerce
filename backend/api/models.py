from django.db import models
from django.contrib.auth.models import User
from main.models import Products

class WishlistItem(models.Model):
    """Item saved to a user's wishlist.

    Only authenticated users can have wishlist entries (as per the requirement).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} – {self.product.name}"