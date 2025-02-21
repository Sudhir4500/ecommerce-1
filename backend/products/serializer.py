from rest_framework import serializers
from .models import product,category
from vendormanagement.models import Vendor  

# class productSerializer(serializers.ModelSerializer):
#     image=serializers.SerializerMethodField()
#     category = serializers.CharField(source='category.category_name')
#     vendor = serializers.CharField(source='vendor.username')
#     class Meta:
#         model = product
#         fields = ['id', 'vendor', 'Product_name','category', 'price', 'description', 'image', 'stock', 'created_at', 'updated_at']
#         read_only_fields = ['vendor', 'created_at', 'updated_at']  # Make vendor read-only
        
#     def get_image(self, obj):
#         if obj.image:
#             return obj.image.url
#         return None
    

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category  # Use correct model name with proper capitalization
        fields = '__all__'  # Use all fields

#     from rest_framework import serializers
# from .models import product

class productSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=category.objects.all())
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    vendor = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all(), required=False)
    image = serializers.ImageField(max_length=None, use_url=True, required=False
    )

    class Meta:
        model = product
        fields = ['id', 'vendor', 'Product_name', 'category', 'category_name', 'price', 'description', 'image', 'stock', 'created_at', 'updated_at']
        read_only_fields = ['vendor', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Ensure the vendor is set to the current user's vendor profile
        vendor = self.context['request'].user.vendor
        validated_data['vendor'] = vendor
        return super().create(validated_data)
    
    def get_image(self, obj):
        if obj.image:
            return obj.image.url

    