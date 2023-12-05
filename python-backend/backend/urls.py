"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.contrib import admin
from django.urls import path, include
from market.service import PriceConsumer

websocket_urlpatterns = [
    path('ws/price/', PriceConsumer.as_asgi()),
]

urlpatterns = [
    path('backend/admin/', admin.site.urls),
    path('backend/market/', include('market.urls')),
    path('backend/users/', include('users.urls')),
    path('backend/transactions/', include('transactions.urls')),
]

urlpatterns += websocket_urlpatterns
