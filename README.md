# Ecommerce

A full-featured ecommerce web application built with Django, featuring product catalog, cart management, wishlist, Razorpay payments, and a REST API.

## Features

- **Product Catalog** — Browse products by category (Power Banks, Bags, Electronics, Gaming) or search by name
- **Shopping Cart** — Add/remove items, increase/decrease quantities, real‑time total calculation with tax and shipping
- **Wishlist** — Save items for later (database for authenticated users, session for guests)
- **User Authentication** — Register, login, logout, password reset flow
- **Payments** — Razorpay integration with order creation, signature verification, and payment callback
- **Order Management** — View order history with status tracking
- **REST API** — DRF endpoints for products, wishlist, and cart
- **Responsive UI** — Django templates with HTMX, JavaScript, and Framer‑Motion animations
- **Image Gallery** — Cloudinary-hosted product images with gallery support

## Tech Stack

| Layer       | Technology |
|-------------|-----------|
| Backend     | Django 6.0, Django REST Framework |
| Frontend    | Django Templates, HTMX, JavaScript, Framer Motion |
| Database    | SQLite (dev) / PostgreSQL (production on Render) |
| Payments    | Razorpay |
| Media       | Cloudinary |
| Styling     | CSS, Tailwind-like utility classes |
| Deployment  | Render (with WhiteNoise for static files) |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js (for frontend dependencies)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate  # Windows
# source venv/bin/activate  # Linux/macOS

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
npm install

# Run migrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### Environment Variables

Create a `.env` file in the project root:

| Variable             | Description                     | Default |
|----------------------|---------------------------------|---------|
| `DEBUG`              | Enable debug mode               | `False` |
| `RAZORPAY_KEY_ID`    | Razorpay API key ID             | (set in settings.py for dev) |
| `RAZORPAY_KEY_SECRET`| Razorpay API secret             | (set in settings.py for dev) |
| `EMAIL_HOST_USER`    | Gmail SMTP user for password reset | — |
| `EMAIL_HOST_PASSWORD`| Gmail SMTP app password         | — |

> **Note:** The repository includes test Razorpay keys in `settings.py`. Replace them with your own keys in production.

## Project Structure

```
ecommerce/
├── api/                  # Django REST Framework app
│   ├── models.py         # WishlistItem model
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # ProductViewSet, WishlistViewSet, CartViewSet
│   └── urls.py           # API routes (/api/products, /api/wishlist, /api/cart)
├── main/                 # Main application
│   ├── models.py         # Products, Cart, Payment, Wishlist, Orders, ProductImage
│   ├── views.py          # All main views (index, cart, payment, wishlist, etc.)
│   ├── urls.py           # URL configuration
│   ├── templates/        # Django HTML templates
│   ├── templatetags/     # Custom template tags
│   ├── context_processors.py  # Cart & wishlist counts for all templates
│   ├── management/       # Custom management commands
│   └── static/           # Static assets (CSS, JS, images)
├── ecommerce/            # Django project settings
│   ├── settings.py       # Project configuration
│   ├── urls.py           # Root URL configuration
│   ├── wsgi.py           # WSGI application
│   └── asgi.py           # ASGI application
├── static/               # Global static files
├── staticfiles/          # Collected static files (production)
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies (axios, framer-motion, etc.)
└── db.sqlite3            # SQLite database (dev)
```

## API Endpoints

All REST API endpoints are prefixed with `/api/`:

| Method | Endpoint            | Description          | Auth Required |
|--------|---------------------|----------------------|---------------|
| GET    | `/api/products/`    | List all products    | No            |
| GET    | `/api/products/:id/`| Product detail       | No            |
| GET    | `/api/wishlist/`    | List user's wishlist | Yes           |
| POST   | `/api/wishlist/`    | Add item to wishlist | Yes           |
| DELETE | `/api/wishlist/:id/`| Remove wishlist item | Yes           |
| GET    | `/api/cart/`        | List cart items      | Yes           |
| POST   | `/api/cart/`        | Add to cart          | Yes           |
| PATCH  | `/api/cart/:id/`    | Update cart item     | Yes           |
| DELETE | `/api/cart/:id/`    | Remove cart item     | Yes           |

## Deployment

The application is configured for deployment on [Render](https://render.com). Key settings:

- `STATICFILES_STORAGE` uses WhiteNoise for compressed/manifest static files
- `ALLOWED_HOSTS` includes `.onrender.com`
- Gunicorn is configured as the WSGI server in `requirements.txt`
- CORS is configured to allow all origins (adjust for production)

## License

MIT
