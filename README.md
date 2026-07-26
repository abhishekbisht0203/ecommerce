# ShopIQ — Ecommerce Platform

A full-featured ecommerce web application with a **React (Vite) SPA frontend** and a **Django REST backend**, featuring product catalog, cart management, wishlist, Razorpay payments, and a premium authentication experience.

## Features

- **Product Catalog** — Browse products by category or search by name, with quick-view modals
- **Shopping Cart** — Add/remove items, increase/decrease quantities, real-time totals (with tax and shipping)
- **Wishlist** — Save items for later (database for authenticated users, session for guests)
- **User Authentication** — Register, login, logout, password reset flow with a premium split-screen UI
- **Payments** — Razorpay integration with order creation, signature verification, and payment callback
- **Order Management** — View order history with status tracking
- **REST API** — DRF endpoints for products, wishlist, and cart
- **Premium Auth UI** — Glassmorphism, animated backgrounds, floating product showcase, social login, password strength indicator
- **Responsive Design** — Mobile-first layout with smooth Framer Motion animations

## Tech Stack

| Layer       | Technology |
|-------------|-----------|
| Backend     | Django 6.0, Django REST Framework |
| Frontend    | React 19, Vite 8, TypeScript 6, Tailwind CSS v4 |
| Animations  | Framer Motion 12, React Icons |
| Database    | SQLite (dev) / PostgreSQL (production on Render) |
| Payments    | Razorpay |
| Media       | Cloudinary |
| Styling     | Tailwind CSS v4 (CSS-first config), CSS animations |
| Deployment  | Render (with WhiteNoise for static files) |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce

# --- Backend ---

# Create and activate a virtual environment
python -m venv backend\venv
.\backend\venv\Scripts\Activate  # Windows
# source backend/venv/bin/activate  # Linux/macOS

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser

# Start the Django server (runs on http://127.0.0.1:8000)
python manage.py runserver
```

```bash
# --- Frontend (separate terminal) ---

# Install dependencies
cd frontend
npm install

# Start the Vite dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build
```

The Vite dev server proxies API requests (`/api`, `/login`, `/register`, etc.) to Django at `http://127.0.0.1:8000`.

### Environment Variables

Create a `.env` file in `backend/`:

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
├── backend/                    # Django backend
│   ├── api/                    # DRF app (products, wishlist, cart endpoints)
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── ecommerce/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── main/                   # Main Django app
│   │   ├── models.py           # Products, Cart, Payment, Wishlist, Orders
│   │   ├── views.py            # Auth views, cart, payment, wishlist, etc.
│   │   ├── urls.py             # URL configuration
│   │   ├── templates/          # Django HTML templates (password reset, legacy)
│   │   ├── templatetags/       # Custom template tags
│   │   └── context_processors.py
│   ├── static/                 # Global static assets
│   ├── staticfiles/            # Collected static files (production)
│   ├── venv/                   # Python virtual environment
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3              # SQLite database (dev)
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── api/                # Axios instance with CSRF + 401 interceptor
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/           # Premium auth components (glassmorphism, particles, etc.)
│   │   │   └── layout/         # Navbar, Footer
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── hooks/              # useMouseParallax, useAnimatedCounter, useDebounce
│   │   ├── lib/                # Framer Motion animation variants
│   │   ├── pages/              # Login, Register, Home, Cart, Checkout, etc.
│   │   ├── services/           # DummyJSON API helpers
│   │   └── types/              # TypeScript interfaces
│   ├── index.css               # Tailwind v4 entry + custom theme
│   ├── vite.config.ts          # Vite config with Django proxy
│   └── package.json
│
├── .gitignore
├── package.json                # Root Node deps (framer-motion, react-icons, etc.)
└── README.md
```

## API Endpoints

All REST API endpoints are prefixed with `/api/`:

| Method | Endpoint            | Description          | Auth Required |
|--------|---------------------|----------------------|---------------|
| GET    | `/api/products/`    | List all products    | No            |
| GET    | `/api/products/:id/`| Product detail       | No            |
| GET    | `/api/auth/user/`   | Current user info    | Yes           |
| GET    | `/api/wishlist/`    | List user's wishlist | Yes           |
| POST   | `/api/wishlist/`    | Add item to wishlist | Yes           |
| DELETE | `/api/wishlist/:id/`| Remove wishlist item | Yes           |
| GET    | `/api/cart/`        | List cart items      | Yes           |
| POST   | `/api/cart/`        | Add to cart          | Yes           |
| PATCH  | `/api/cart/:id/`    | Update cart item     | Yes           |
| DELETE | `/api/cart/:id/`    | Remove cart item     | Yes           |

### Auth endpoints (proxied to Django)

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | `/login/`           | Log in (form-data)   |
| POST   | `/register/`        | Register (form-data) |
| GET    | `/logout/`          | Log out              |

## Auth UI Features

The login and register pages feature a premium split-screen design:

- **Animated Background** — Gradient orbs with slow ambient movement and floating particles
- **Glassmorphism Card** — Frosted glass auth card with backdrop blur and gradient border glow
- **Floating Product Showcase** — Real products from DummyJSON with mouse parallax and hover effects
- **Premium Form Inputs** — Animated floating labels, focus glow, inline validation, password toggle
- **Password Strength Indicator** — Live strength bar (Weak → Strong) with color-coded feedback
- **Social Login Buttons** — Google, Apple, GitHub (placeholder handlers ready for integration)
- **Responsive** — Split-screen on desktop, stacked on mobile

## Deployment

The application is configured for deployment on [Render](https://render.com). Key settings:

- `STATICFILES_STORAGE` uses WhiteNoise for compressed/manifest static files
- `ALLOWED_HOSTS` includes `.onrender.com`
- Gunicorn is configured as the WSGI server in `requirements.txt`
- CORS is configured to allow all origins (adjust for production)

## License

MIT
