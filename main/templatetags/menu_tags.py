from django import template

register = template.Library()

@register.simple_tag
def get_menu_items():
    """Return the list of menu items for the navbar."""
    return [
        {"name": "Home", "url": "/"},
        {"name": "Shop", "url": "/product/"},
        {"name": "Collections", "url": "/wishlist"},
        {"name": "About", "url": "/#about"},
        {"name": "Contact", "url": "/#contact"},
    ]
