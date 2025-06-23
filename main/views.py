from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login , logout
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.contrib.auth.models import User
from .models import *
from decimal import Decimal
#CSRF_EXCEMPT DECORATOR
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.conf import settings
import razorpay
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Cart, Products
import logging

# Create your views here.
def index(request):
    query = request.GET.get('q', '')  # Get search query from URL
    products = Products.objects.all()

    if query:
        products = products.filter(name__icontains=query)  # Filter by name contains
    return render(request, "index.html", {"products" : products, "query": query})


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
        return redirect('form')  # Prevents duplicate save on refresh

    return render(request, "form.html")

@csrf_exempt
@login_required
def addtocart(request, product_id):
    user = request.user
    product = Products.objects.get(id = product_id)
    if Cart.objects.filter(user=user, product=product).exists():
        cart = Cart.objects.get(user=user, product=product)
        cart.quantity += 1
        cart.total = int(cart.product.price * cart.quantity)
        cart.save()
    
        total_sum =Cart.objects.aggregate(total_sum=Sum('total'))['total_sum']
        if Payment.objects.filter(user=user).exists():
            payment = Payment.objects.get(user = user)
            payment.amount = total_sum
            payment.save()
        else:
            Payment.objects.create(user=user, amount=total_sum)
        total_tax = int(total_sum * 0.05)
        sub_total = int(total_sum + total_tax)
        return JsonResponse({"success": "Cart item quantity increased", "quantity": cart.quantity, "total": cart.total , "total_sum": total_sum, "total_tax": total_tax, "sub_total":sub_total})
    else:  
        Cart.objects.create(user=user, product=product ,total=product.price)
        return JsonResponse({"success": "Cart item added "})
    
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
    products = products.objects.all()
    return render (request, "product.html", {"products" : products})

@login_required
def cart(request):
    
    subtotal = Decimal('0')
    cart_items = Cart.objects.filter(user = request.user)
    tax = Decimal('0.05')
    shipping_charges = 10
    for item in cart_items:
        subtotal = subtotal + item.total
    tax = subtotal * tax
    total = subtotal + tax + shipping_charges
    return render (request, "cart.html", {"cart_items": cart_items, "subtotal": subtotal, 'tax':tax, 'shipping_charges':shipping_charges, 'total':total})



def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        print(username, password)
        user = authenticate(request, username=username, password=password)
        print (user)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid credentials'})
    return render(request,'login_user.html')


def logout_user(request):
    logout(request)
    return redirect("home")



def register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "This username already exists"}, status=400)
        elif User.objects.filter(email=email).exists():
            return JsonResponse({"error": "This email already exists"}, status=400)

        # Create the user
        user = User.objects.create_user(username=username, password=password, email=email)

        if user:
            return JsonResponse({"success": "User registered successfully", "redirect": "/login/"}, status=200)

    return render(request, "register.html")

    

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





# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def payment(request):
    if request.method == 'GET':
        # Fetch cart items for the logged-in user
        cart_items = Cart.objects.filter(user=request.user)
        
        if not cart_items.exists():
            return HttpResponseBadRequest("Your cart is empty")

        # Calculate subtotal
        subtotal = cart_items.aggregate(total=Sum('total'))['total'] or Decimal(0)
        
        # Tax & Shipping Charges
        tax = subtotal * Decimal('0.05')
        shipping_charges = Decimal(10)
        
        # Final total
        total = subtotal + tax + shipping_charges
        
        # Convert total to paisa (Razorpay works in paisa)
        amount_in_paisa = int(total * 100)

        # Create a Razorpay order
        payment_order = razorpay_client.order.create({
            'amount': amount_in_paisa,
            'currency': 'INR',
            'payment_capture': '1'  # Auto capture after successful payment
        })

        context = {
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,  # Razorpay key id
            'order_id': payment_order['id'],  # The Razorpay order id
            'amount': total,  # Show the total in INR
            'subtotal': subtotal,
            'tax': tax,
            'shipping_charges': shipping_charges,
            'cart': cart_items  # Pass cart items to template
        }

        return render(request, 'payment.html', context)

    return HttpResponseBadRequest("Invalid Request")



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
    payment_id = request.POST.get('razorpay_payment_id')
    order_id = request.POST.get('razorpay_order_id')
    return render(request, 'payment_success.html', {'payment_id': payment_id, 'order_id': order_id})


@login_required
def orders(request):
    orders = Orders.objects.filter(user=request.user)
    return render(request, "orders.html", {"orders": orders})

def powerbank_view(request):
    powerbanks = Products.objects.filter(category__iexact="Power Bank")
    return render(request, 'powerbank.html', {'products': powerbanks})

def bags_view(request):
    bags = Products.objects.filter(category__iexact="Bag")
    return render(request, 'bags.html', {'products': bags})

def electronics_view(request):
    electronics = Products.objects.filter(category__iexact="Electronics")
    return render(request, 'electronics.html', {'products': electronics})

def gaming_view(request):
    gaming = Products.objects.filter(category__iexact="Gaming")
    return render(request, 'gaming.html', {'products': gaming})
