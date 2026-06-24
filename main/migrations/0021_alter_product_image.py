"""
Migration to change Products.image from URLField to ImageField.
"""

from django.db import migrations, models
import django.core.files.storage

class Migration(migrations.Migration):
    dependencies = [
        ('main', '0020_products_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='products/'),
        ),
    ]
