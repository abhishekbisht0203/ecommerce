from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField


# Create your models here.
class Products(models.Model):
    pass  # placeholder to keep line numbers
    # Existing fields remain unchanged
    # Existing fields remain unchanged
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)  

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.user.username}, {self.product.name}"
    



class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length=255)
    payment_id = models.CharField(max_length=100, unique=True)  # Razorpay Payment ID
    order_id = models.CharField(max_length=100, unique=True)  # Razorpay Order ID
    status = models.CharField(max_length=20, choices=[('Success', 'Success'), ('Failed', 'Failed')], default='Success')

    def __str__(self):
        return f"Payment {self.payment_id} - {self.user.username} - {self.amount}"

    
class Wishlist(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Guest'} - {self.product.name}"

class ProductImage(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image')

    def __str__(self):
        return f"Image for {self.product.name}"

class Orders(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Add total field
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # Add status field

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        self.total = self.product.price * self.quantity
        super().save(*args, **kwargs)   
    
    
    