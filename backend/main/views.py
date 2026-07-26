from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login , logout
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.contrib.auth.models import User
from .models import *
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.conf import settings
from pathlib import Path
import razorpay
import json
from .models import Cart, Products
import logging
import json

logger = logging.getLogger(__name__)


def _get_json_data(request):
    """Parse JSON body if Content-Type is application/json, else return None."""
    if request.method == "POST" and request.content_type == "application/json":
        try:
            return json.loads(request.body)
        except (json.JSONDecodeError, AttributeError, UnicodeDecodeError):
            return None
    return None


def _get_param(request, name, default=None):
    """Get a parameter from either POST data or parsed JSON body."""
    data = _get_json_data(request)
    if data is not None:
        return data.get(name, default)
    return request.POST.get(name, default)


# Create your views here.

def serve_react(request):
    """Serve the React SPA index.html for any frontend route."""
    index_path = Path(settings.REACT_BUILD_DIR) / 'index.html'
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return HttpResponse(
        "Frontend not built yet. Run `cd frontend && npm run build` then refresh.",
        status=501,
    )

def index(request):
    return serve_react(request)


def form(request):
    if request.method == "POST":
        name = request.POST["name"]
        description = request.POST["description"]
        price = request.POST["price"]
        image = request.POST["image"]
        category = request.POST["category"]

        Products.objects.create(
            name=name,
            description=description,
            price=price,
            image=image,
            category=category
        )
        return JsonResponse({"success": True})

    return serve_react(request)

@csrf_exempt
@login_required
def addtocart(request, product_id):
    user = request.user

    try:
        # Get the product
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    # Check if the product is already in the cart
    cart_item, created = Cart.objects.get_or_create(user=user, product=product)
    if not created:
        # If it exists, increase the quantity and update the total
        cart_item.quantity += 1
        cart_item.total = cart_item.quantity * product.price
        cart_item.save()
    else:
        # If new, set the total for the product
        cart_item.total = product.price
        cart_item.save()

    return JsonResponse({"success": True, "quantity": cart_item.quantity, "total": cart_item.total, "cart_count": Cart.objects.filter(user=user).aggregate(total_qty=Sum('quantity'))['total_qty'] or 0})

    
@csrf_exempt
@login_required
def increase_quantity(request, product_id):
    if request.method == "POST":
        user = request.user
        product = Products.objects.get(id=product_id)
        
        # Get or create cart item
        cart, created = Cart.objects.get_or_create(user=user, product=product, defaults={'quantity': 1, 'total': product.price})
        if not created:
            cart.quantity += 1
            cart.total = cart.product.price * cart.quantity
            cart.save()
        
        # Calculate totals
        total_sum = Cart.objects.filter(user=user).aggregate(total_sum=Sum('total'))['total_sum'] or 0
        total_tax = int(total_sum * 0.05)
        sub_total = int(total_sum + total_tax)

        return JsonResponse({"success": True, "quantity": cart.quantity, "total": cart.total, "total_sum": total_sum, "total_tax": total_tax, "sub_total": sub_total})
    
    return JsonResponse({"error": "Invalid request"}, status=400)


def product(request):
    return serve_react(request)

def product_detail(request, product_id):
    return serve_react(request)

@login_required
def cart(request):
    return serve_react(request)



@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            username = _get_param(request, 'username', '').strip()
            password = _get_param(request, 'password', '')
            raw_remember = _get_param(request, 'remember')
            if isinstance(raw_remember, str):
                remember = raw_remember.lower() not in ('', 'false', '0')
            else:
                remember = bool(raw_remember)

            if not username:
                return JsonResponse({'success': False, 'message': 'Username or email is required.'}, status=400)
            if not password:
                return JsonResponse({'success': False, 'message': 'Password is required.'}, status=400)

            auth_username = username
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    auth_username = user_obj.username
                except User.DoesNotExist:
                    return JsonResponse({'success': False, 'message': 'Invalid credentials.'}, status=401)

            user = authenticate(request, username=auth_username, password=password)
            if user is not None:
                login(request, user)
                if not remember:
                    request.session.set_expiry(0)
                return JsonResponse({
                    'success': True,
                    'message': 'Login successful.',
                    'user': {'id': user.id, 'username': user.username, 'email': user.email}
                })
            else:
                return JsonResponse({'success': False, 'message': 'Invalid credentials.'}, status=401)

        except Exception as e:
            logger.error(f"Login error: {e}", exc_info=True)
            return JsonResponse({'success': False, 'message': 'Login failed. Please try again later.'}, status=500)

    return serve_react(request)


def logout_user(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully."})



@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            username = _get_param(request, "username", "").strip()
            password = _get_param(request, "password", "")
            email = _get_param(request, "email", "").strip()

            if not username:
                return JsonResponse({"success": False, "message": "Full name is required."}, status=400)
            if not email:
                return JsonResponse({"success": False, "message": "Email is required."}, status=400)
            if not password:
                return JsonResponse({"success": False, "message": "Password is required."}, status=400)
            if len(password) < 8:
                return JsonResponse({"success": False, "message": "Password must be at least 8 characters."}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"success": False, "message": "This username already exists."}, status=409)
            if User.objects.filter(email=email).exists():
                return JsonResponse({"success": False, "message": "This email already exists."}, status=409)

            user = User.objects.create_user(username=username, password=password, email=email)

            return JsonResponse({"success": True, "message": "Account created successfully!", "redirect": "/login"}, status=201)

        except Exception as e:
            logger.error(f"Registration error: {e}", exc_info=True)
            return JsonResponse({"success": False, "message": "Registration failed. Please try again later."}, status=500)

    return serve_react(request)

    

@csrf_exempt
def removefromcart(request, product_id):
    product = Products.objects.get(id=product_id)
    cart = Cart.objects.get(product=product, user=request.user)
    cart.delete()
    return JsonResponse({"success": "Item is removed"})



@csrf_exempt
@login_required
def decrease_quantity(request, product_id):
    if request.method == "POST":
        user = request.user
        product = Products.objects.get(id=product_id)

        try:
            cart = Cart.objects.get(user=user, product=product)
            if cart.quantity > 1:
                cart.quantity -= 1
                cart.total = cart.product.price * cart.quantity
                cart.save()
            else:
                cart.delete()  # Remove item if quantity reaches 0

            # Recalculate totals
            total_sum = Cart.objects.filter(user=user).aggregate(total_sum=Sum('total'))['total_sum'] or 0
            total_tax = int(total_sum * 0.05)
            sub_total = int(total_sum + total_tax)

            return JsonResponse({"success": True, "quantity": cart.quantity if cart.quantity > 0 else 0, 
                                 "total": cart.total if cart.quantity > 0 else 0,
                                 "total_sum": total_sum, "total_tax": total_tax, "sub_total": sub_total})
        except Cart.DoesNotExist:
            return JsonResponse({"error": "Item not found"}, status=404)
    
    return JsonResponse({"error": "Invalid request"}, status=400)





# Wishlist Views
from django.views.decorators.http import require_POST

@require_POST
def add_to_wishlist(request, product_id):
    """Add a product to the wishlist.
    Authenticated users get a Wishlist entry; guests use session storage.
    Returns JSON for HTMX.
    """
    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    if request.user.is_authenticated:
        Wishlist.objects.get_or_create(user=request.user, product=product)
    else:
        wishlist = request.session.get('wishlist', [])
        if product_id not in wishlist:
            wishlist.append(product_id)
            request.session['wishlist'] = wishlist
    # Return updated count
    count = Wishlist.objects.filter(user=request.user).count() if request.user.is_authenticated else len(request.session.get('wishlist', []))
    return JsonResponse({"success": True, "count": count})

@require_POST
def remove_from_wishlist(request, product_id):
    """Remove a product from the wishlist (auth or session)."""
    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    if request.user.is_authenticated:
        Wishlist.objects.filter(user=request.user, product=product).delete()
    else:
        wishlist = request.session.get('wishlist', [])
        if product_id in wishlist:
            wishlist.remove(product_id)
            request.session['wishlist'] = wishlist
    count = Wishlist.objects.filter(user=request.user).count() if request.user.is_authenticated else len(request.session.get('wishlist', []))
    return JsonResponse({"success": True, "count": count})

def wishlist_page(request):
    return serve_react(request)

# Quick view modal - returns JSON for the JS modal
def quick_view(request, product_id):
    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    
    # Build image URL
    image_url = ''
    if product.image:
        try:
            image_url = product.image.url
        except Exception:
            image_url = str(product.image)
    
    return JsonResponse({
        'id': product.id,
        'name': product.name,
        'description': product.description if hasattr(product, 'description') else '',
        'price': str(product.price),
        'image_url': image_url,
        'image': image_url,
    })

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@login_required
def payment(request):
    cart_items = Cart.objects.filter(user=request.user)
    
    if not cart_items.exists():
        return JsonResponse({"error": "Cart is empty"}, status=400)

    subtotal = cart_items.aggregate(total=Sum('total'))['total'] or Decimal(0)
    tax = subtotal * Decimal('0.05')
    shipping_charges = Decimal(10)
    total = subtotal + tax + shipping_charges
    amount_in_paisa = int(total * 100)

    payment_order = razorpay_client.order.create({
        'amount': amount_in_paisa,
        'currency': 'INR',
        'payment_capture': '1',
    })

    cart_data = [
        {
            "id": item.id,
            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "price": str(item.product.price),
                "image": item.product.image,
            },
            "quantity": item.quantity,
            "total": str(item.total),
        }
        for item in cart_items
    ]

    return JsonResponse({
        'razorpay_key_id': settings.RAZORPAY_KEY_ID,
        'order_id': payment_order['id'],
        'amount': float(total),
        'subtotal': float(subtotal),
        'tax': float(tax),
        'shipping_charges': float(shipping_charges),
        'cart': cart_data,
    })



logger = logging.getLogger(__name__)

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@csrf_exempt
def payment_callback(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.info(f"Received Payment Data: {data}")

            razorpay_payment_id = data.get('razorpay_payment_id')
            razorpay_order_id = data.get('razorpay_order_id')
            razorpay_signature = data.get('razorpay_signature')

            # Verify Razorpay signature
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }

            try:
                razorpay_client.utility.verify_payment_signature(params_dict)
            except razorpay.errors.SignatureVerificationError:
                logger.error("Signature verification failed")
                return JsonResponse({'status': 'failure', 'message': 'Signature verification failed'}, status=400)

            # Ensure user is authenticated
            if not request.user.is_authenticated:
                return JsonResponse({'status': 'failure', 'message': 'User not authenticated'}, status=400)

            user = request.user  
            cart_items = Cart.objects.filter(user=user)

            if not cart_items.exists():
                return JsonResponse({'status': 'failure', 'message': 'Cart is already empty'}, status=400)

            # Calculate total price
            subtotal = cart_items.aggregate(total=Sum('total'))['total'] or Decimal(0)
            tax = subtotal * Decimal('0.05')  # 5% tax
            shipping_charges = Decimal(10)
            total = subtotal + tax + shipping_charges

            # Save Payment Record
            Payment.objects.create(
                user=user,
                amount=total,
                address=user.profile.address if hasattr(user, 'profile') else "N/A",
                payment_id=razorpay_payment_id,
                order_id=razorpay_order_id,
                status="Success",
            )
            
              # ✅ Save Each Cart Item as an Order
            for item in cart_items:
                Orders.objects.create(
                    user=user,
                    product=item.product,
                    quantity=item.quantity,
                    total=item.total,
                    address=user.profile.address if hasattr(user, 'profile') else "N/A",
                    phone=user.profile.phone if hasattr(user, 'profile') else "N/A",
                    status="Pending"  # Default status
                )

            # ✅ Clear cart after successful payment
            cart_items.delete()

            logger.info(f"✅ Payment saved for user: {user.username}")
            return JsonResponse({'status': 'success', 'message': 'Payment successful, cart cleared'})

        except Exception as e:
            logger.error(f"❌ Error in payment_callback: {e}")
            return JsonResponse({'status': 'failure', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'failure', 'message': 'Invalid request'}, status=400)



@csrf_exempt
def payment_success(request):
    if request.method == 'POST':
        payment_id = request.POST.get('razorpay_payment_id')
        order_id = request.POST.get('razorpay_order_id')
        return JsonResponse({'payment_id': payment_id, 'order_id': order_id})
    return serve_react(request)


@login_required
def orders(request):
    if request.method == 'GET':
        orders_qs = Orders.objects.filter(user=request.user)
        data = [
            {
                "id": o.id,
                "product": str(o.product),
                "quantity": o.quantity,
                "total": str(o.total),
                "status": o.status,
            }
            for o in orders_qs
        ]
        return JsonResponse({"orders": data})
    return serve_react(request)

def powerbank_view(request):
    return serve_react(request)

def bags_view(request):
    return serve_react(request)

def electronics_view(request):
    return serve_react(request)

def gaming_view(request):
    return serve_react(request)
