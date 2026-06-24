from rest_framework import serializers
from main.models import Products, Cart
from .models import WishlistItem

class ProductSerializer(serializers.ModelSerializer):
    """Serialize product information, including a list of image URLs.

    The original Products model only has a single `image` field. To support multiple
    images we will expose it as a list – if the product has only one image we return
    that in a list; otherwise future migrations can add a separate Image model.
    """
    images = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = ['id', 'name', 'description', 'price', 'category', 'images']

    def get_images(self, obj):
        if obj.image:
            return [obj.image]
        return []

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all(), source='product', write_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'user', 'product', 'product_id', 'added_at']
        read_only_fields = ['id', 'user', 'product', 'added_at']

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all(), source='product', write_only=True)
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'product_id', 'quantity']
        read_only_fields = ['id', 'user', 'product']

    def create(self, validated_data):
        # If an entry for this user+product already exists, increment quantity
        user = self.context['request'].user
        product = validated_data['product']
        quantity = validated_data.get('quantity', 1)
        cart_item, created = Cart.objects.get_or_create(user=user, product=product, defaults={'quantity': quantity})
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        return cart_item

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.save()
        return instance
