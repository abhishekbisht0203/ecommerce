import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/addtocart': 'http://127.0.0.1:8000',
      '/removefromcart': 'http://127.0.0.1:8000',
      '/increase_quantity': 'http://127.0.0.1:8000',
      '/decrease_quantity': 'http://127.0.0.1:8000',
      '/wishlist': 'http://127.0.0.1:8000',
      '/quickview': 'http://127.0.0.1:8000',
      '/login': 'http://127.0.0.1:8000',
      '/logout': 'http://127.0.0.1:8000',
      '/register': 'http://127.0.0.1:8000',
      '/payment': 'http://127.0.0.1:8000',
      '/orders': 'http://127.0.0.1:8000',
      '/sync-cart': 'http://127.0.0.1:8000',
      '/sync-cart/': 'http://127.0.0.1:8000',
      '/password-reset': 'http://127.0.0.1:8000',
      '/form': 'http://127.0.0.1:8000',
    }
  }
})
