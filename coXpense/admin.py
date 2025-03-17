from django.contrib import admin
from .models import Group
from .models import Invitation
from .models import Expense
from .models import UserProfile

class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'closed_at')
    list_filter = ('name','created_at')  # Filtros por campo1
    search_fields = ('name',)  # Campos de búsqueda
    ordering = ('created_at',)  # Ordenación por campo3


"""Register your models here."""
admin.site.register(UserProfile)
admin.site.register(Group, GroupAdmin)
admin.site.register(Invitation)
admin.site.register(Expense)