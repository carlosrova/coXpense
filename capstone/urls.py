"""
URL configuration for capstone project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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

from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from django.conf import settings
from django.http import FileResponse
import os

def index_view(request):
    print(f"index_view path = '{request.path}'")
    index_file_path = os.path.join(settings.STATIC_ROOT, 'coXpense', 'index.html')
    return FileResponse(open(index_file_path, 'rb'))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("coXpense.urls")),
    re_path(r'^(?!api/)(?:.*)/?$', index_view, name='index'),
]
