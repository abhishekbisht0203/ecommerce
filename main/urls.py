from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="home"),
    path('product/', views.product, name="product"),
    path('login/', views.login_user, name="login"),
    path('logout/', views.logout_user, name="logout"),
    path('register/', views.register, name="register"),
    path('cart/', views.cart, name="cart"),
    path('payment/', views.payment, name="payment"),
    path('form/', views.form, name="form"),
    path("addtocart/<int:product_id>/", views.addtocart, name="addtocart"),
    path("removefromcart/<int:product_id>/", views.removefromcart, name="removefromcart"),
    path("decrease_quantity/<int:product_id>/", views.decrease_quantity, name="decrease_quantity"),
    path("increase_quantity/<int:product_id>/", views.increase_quantity, name="increase_quantity"),
    path('payment/callback/', views.payment_callback, name='payment_callback'),
    path('payment/success/', views.payment_success, name='payment_success'),
    path('orders/', views.orders, name='orders'),
]

