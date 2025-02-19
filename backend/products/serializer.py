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
    # category = serializers.CharField(source='category.category_name')
    category = serializers.PrimaryKeyRelatedField(queryset=category.objects.all())
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    # category = serializers.PrimaryKeyRelatedField(queryset=category.objects.all())
    vendor = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all(), required=False)  # Make it required=False, as it's set automatically

    class Meta:
        model = product
        fields = ['id', 'vendor', 'Product_name', 'category','category_name', 'price', 'description', 'image', 'stock', 'created_at', 'updated_at']
        read_only_fields = ['vendor', 'created_at', 'updated_at']  # Make vendor read-only, since it's set automatically

    def create(self, validated_data):
        # Explicitly handle the creation of the product
        vendor = validated_data.get('vendor', None)
        if vendor is None:
            raise serializers.ValidationError("Vendor must be specified.")
        
        return super().create(validated_data)

    