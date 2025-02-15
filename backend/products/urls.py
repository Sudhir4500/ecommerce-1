# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import ProductViewSet, CategoryViewSet

# router = DefaultRouter()
# router.register(r'products', ProductViewSet)


# urlpatterns = [
#     path('', include(router.urls)),
#     path('categories/', CategoryViewSet.as_view({'get': 'list'}), name='categories'),
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)  # This ensures you can fetch individual categories

urlpatterns = [
    path('', include(router.urls)),
]

