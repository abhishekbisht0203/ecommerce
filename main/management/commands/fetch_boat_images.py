import os
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from main.models import Products

class Command(BaseCommand):
    help = "Download a set of Boat product images and assign them to Products without images"

    # Pre‑defined list of Boat image URLs (taken from the hero slider template)
    BOAT_IMAGE_URLS = [
        "https://www.boat-lifestyle.com/cdn/shop/files/AD_311_PRO_HP_Banner_WEB_78ba2528-4e39-4bbd-93b6-46e00c9a268d_1600x.jpg?v=1716892767",
        "https://www.boat-lifestyle.com/cdn/shop/files/RS_Banner_WEB_1_1440x.jpg?v=1706770352",
        "https://www.boat-lifestyle.com/cdn/shop/files/S750_WEB_1600x.jpg?v=1723464973",
        "https://www.boat-lifestyle.com/cdn/shop/files/Artboard_2_041ea472-08ce-4427-b936-337ec75915fe.png?v=1778477258",
        "https://www.boat-lifestyle.com/cdn/shop/files/Airdopes_Supreme_Banner_WEB_1515c104-abee-4263-8e44-4511088592de_1600x.jpg?v=1712209151",
    ]

    def handle(self, *args, **options):
        # Ensure media/products directory exists
        product_media_dir = os.path.join(settings.MEDIA_ROOT, "products")
        os.makedirs(product_media_dir, exist_ok=True)

        # Download images if they don't already exist locally
        local_paths = []
        for url in self.BOAT_IMAGE_URLS:
            filename = os.path.basename(url.split("?")[0])  # strip query string
            local_path = os.path.join(product_media_dir, filename)
            if not os.path.isfile(local_path):
                self.stdout.write(f"Downloading {url} ...")
                try:
                    resp = requests.get(url, timeout=10)
                    resp.raise_for_status()
                    with open(local_path, "wb") as f:
                        f.write(resp.content)
                except Exception as e:
                    self.stderr.write(f"Failed to download {url}: {e}")
                    continue
            else:
                self.stdout.write(f"Already cached: {filename}")
            # Store relative path for ImageField assignment
            rel_path = os.path.join("products", filename)
            local_paths.append(rel_path)

        # Assign images to Products that currently have no image
        products_without_image = Products.objects.filter(image="").order_by("id")
        if not products_without_image.exists():
            self.stdout.write(self.style.SUCCESS("All products already have images."))
            return

        self.stdout.write(f"Assigning images to {products_without_image.count()} products...")
        for i, product in enumerate(products_without_image):
            # Cycle through the downloaded images if there are fewer than products
            img_path = local_paths[i % len(local_paths)]
            product.image = img_path
            product.save()
            self.stdout.write(f"Set image for {product.name} -> {img_path}")

        self.stdout.write(self.style.SUCCESS("Image population complete."))
