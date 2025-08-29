from rest_framework import serializers
from .models import Post, Comment
from .supabase_client import supabase
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']  # only content is required for creation

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Comment cannot be empty")
        if len(value) > 255:
            raise serializers.ValidationError("Comment cannot exceed 255 characters")
        return value

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
    user = UserSerializer(read_only=True)  # 👈 full details
    liked_by_user = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'content', 'image', 'category',
            'like_count', 'comment_count', 'is_active',
            'created_at', 'updated_at', 'liked_by_user',
            'comments',
        ]

    def get_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False





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



class LikeSerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'like_count', 'liked']

    def get_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return request.user in obj.liked_by.all()
        return False
    


