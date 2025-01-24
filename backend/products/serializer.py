from rest_framework import serializers
from .models import product,category

class productSerializer(serializers.ModelSerializer):
    image=serializers.SerializerMethodField()
    category = serializers.CharField(source='category.category_name')
    vendor = serializers.CharField(source='vendor.username')
    class Meta:
        model = product
        fields = ['id', 'vendor', 'Product_name','category', 'price', 'description', 'image', 'stock', 'created_at', 'updated_at']
        read_only_fields = ['vendor', 'created_at', 'updated_at']  # Make vendor read-only
        
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None
    

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category  # Use correct model name with proper capitalization
        fields = '__all__'  # Use all fields

#     from rest_framework import serializers
# from .models import product

# class productSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = product
#         fields = ['id', 'vendor', 'Product_name', 'price', 'description', 'image', 'stock', 'created_at', 'updated_at']
#         read_only_fields = ['vendor', 'created_at', 'updated_at']  # Make vendor read-only

    