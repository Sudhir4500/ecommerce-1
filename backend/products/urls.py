from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoryViewSet.as_view({'get': 'list'}), name='categories'),
]
