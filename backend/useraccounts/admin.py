from django.contrib import admin
from .models import User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_active')
# class profileAdmin(admin.ModelAdmin):
#     list_display = ('full_name','verified')
    

admin.site.register(User,UserAdmin)
# admin.site.register(profile,profileAdmin)
