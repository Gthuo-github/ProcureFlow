from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=50)
    price =  models.DecimalField(default=0, decimal_places=2, max_digits=12)
    category =  models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    description =  models.CharField(max_length=250, default='', blank=True, null=True)
    image =  models.ImageField(upload_to='uploads/product/')

    def __str__(self):
        return self.name


