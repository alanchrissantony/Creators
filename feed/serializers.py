from rest_framework import serializers
from .models import Post
from .supabase_client import supabase
import uuid




class PostCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['content', 'image', 'category']

    def validate_content(self, value):
        if value and len(value) > 280:
            raise serializers.ValidationError("Content exceeds 280 characters")
        return value

    def validate_image(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("Image size must be < 2MB")
            if not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
                raise serializers.ValidationError("Only JPEG and PNG images are allowed")
        return value

    def create(self, validated_data):
        image_file = validated_data.pop('image', None)
        if image_file:
            import uuid
            file_name = f"posts/{uuid.uuid4()}.jpg"
            file_bytes = image_file.read()

            try:
                supabase.storage.from_("posts").upload(file_name, file_bytes)
            except:
                raise serializers.ValidationError("Failed to upload image to Supabase")

            # Get public URL
            url = supabase.storage.from_("posts").get_public_url(file_name)
            validated_data['image'] = url

        return Post.objects.create(**validated_data)




class PostListSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'content', 'image', 'category',
            'like_count', 'comment_count', 'is_active',
            'created_at', 'updated_at'
        ]




class PostUpdateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['content', 'image', 'category']

    def validate_content(self, value):
        if value and len(value) > 280:
            raise serializers.ValidationError("Content exceeds 280 characters")
        return value

    def validate_image(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("Image size must be < 2MB")
            if not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
                raise serializers.ValidationError("Only JPEG and PNG images are allowed")
        return value

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image', None)
        if image_file:
            import uuid
            file_name = f"posts/{uuid.uuid4()}.jpg"
            file_bytes = image_file.read()

            res = supabase.storage.from_("posts").upload(file_name, file_bytes)
            if res.error:
                raise serializers.ValidationError("Failed to upload image to Supabase")

            url = supabase.storage.from_("posts").get_public_url(file_name).public_url
            validated_data['image'] = url

        return super().update(instance, validated_data)

