from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

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
    path('powerbanks/', views.powerbank_view, name='powerbanks'),
    path('bags/', views.bags_view, name='bags'),
    path('electronics/', views.electronics_view, name='electronics'),
    path('gaming/', views.gaming_view, name='gaming'),
    
    # forget password
    path('password-reset/', auth_views.PasswordResetView.as_view(template_name='password_reset.html'), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'), name='password_reset_complete'),
    
]

