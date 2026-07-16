from django.shortcuts import render

def invoices(request):
    return render(request, 'home.html', {})
