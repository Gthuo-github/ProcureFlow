from django.db import models

class Supplier(models.Model):
    company_name = models.CharField(max_length=20)
    company_address =  models.CharField(max_length=20)
    email =  models.EmailField(max_length=50)
    password =  models.CharField(max_length=50)
    phone =  models.CharField(max_length=20)

    def __str__(self):
        return self.company_name
