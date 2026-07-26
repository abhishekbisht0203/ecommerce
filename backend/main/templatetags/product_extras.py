"""
Template tags for product utilities.
Provides a smart image URL resolver with local fallback based on product name.
"""

import re
import requests
from django import template
from django.templatetags.static import static

register = template.Library()

# Mapping of keyword regex patterns to fallback image filenames (stored in static/images/fallback/)
CATEGORY_MAP = {
    r"laptop\s*bag|lap\s*bag|office\s*bag|travel\s*bag": "laptop-bag.jpg",
    r"gaming\s*chair|gaming\s*mouse|gaming\s*keyboard|gaming\s*headset|gaming": "gaming.jpg",
    r"hard\s*disk|ssd|game\s*drive|usb\s*drive|pendrive|storage": "storage.jpg",
    r"earbuds|headphones|neckband|speaker|airdopes|audio": "audio.jpg",
}

def _detect_fallback(name: str) -> str:
    """Return fallback filename based on product name.
    If no pattern matches, returns 'default.jpg'.
    """
    lowered = name.lower()
    for pattern, filename in CATEGORY_MAP.items():
        if re.search(pattern, lowered):
            return filename
    return "default.jpg"

@register.simple_tag
def product_image_url(product):
    """Return a valid image URL for a product.
    1. If product.image is truthy, perform a HEAD request (0.5s timeout) to verify existence.
    2. If the request succeeds (status 200), return that URL.
    3. Otherwise, return a local fallback based on product name.
    """
    # If the product has an uploaded image, use its URL directly.
    # ImageField provides a URL attribute that points to MEDIA_URL.
    # No need for a network HEAD request.
    # Try ImageField (local upload)
    img_field = getattr(product, "image", None)
    if img_field:
        # ImageField instance has a .url attribute
        if hasattr(img_field, "url"):
            try:
                if img_field.storage.exists(img_field.name):
                    return img_field.url
            except Exception:
                pass
        # If the value is a plain string (e.g., external URL stored in URLField)
        if isinstance(img_field, str) and img_field.startswith("http"):
            return img_field
    # Fallback to category‑based placeholder image (static or external)
    placeholder_url = f"https://via.placeholder.com/300?text={product.name.replace(' ', '+')}"
    return placeholder_url
