import os
import django
import requests

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from main.models import Products

def fetch_products():
    url = 'https://dummyjson.com/products'
    response = requests.get(url)

    if response.status_code == 200:
        products = response.json().get('products', [])
        for item in products:
            Products.objects.create(
                name=item['title'],
                description=item['description'],
                price= item['price'],
                image= item['thumbnail'],
            )
    else:
        print(f'Failed to fetch products. Status code: {response.status_code}')

if __name__ == '__main__':
    fetch_products()