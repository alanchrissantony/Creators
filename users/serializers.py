from rest_framework import serializers
from accounts.models import User
from feed.config import supabase
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    post_count = serializers.IntegerField(read_only=True)
    verified = serializers.BooleanField(source="is_verified", read_only=True)
    followed_by_user = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email",
            "first_name", "last_name",
            "name", "followed_by_user",
            "bio", "about", "avatar",
            "followers_count", "following_count",
            "post_count", "verified",
            "created_at", "updated_at"
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()
    
    def get_followed_by_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False
    
    def get_name(self, obj):
        return f"{obj.first_name or ''} {obj.last_name or ''}".strip()
    


class UserUpdateSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "bio", "about", "avatar"]
        extra_kwargs = {
            "first_name": {"required": False},
            "last_name": {"required": False},
            "bio": {"required": False},
            "about": {"required": False},
        }

    def validate_avatar(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("Image size must be < 2MB")
            if not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
                raise serializers.ValidationError("Only JPEG and PNG images are allowed")
        return value

    def update(self, instance, validated_data):
        avatar_file = validated_data.pop("avatar", None)
        if avatar_file:
            import uuid

            file_name = f"posts/{uuid.uuid4()}.jpg"
            file_bytes = avatar_file.read()

            try:
                supabase.storage.from_("posts").upload(file_name, file_bytes)
            except Exception:
                raise serializers.ValidationError("Failed to upload avatar to Supabase")

            url = supabase.storage.from_("posts").get_public_url(file_name)
            instance.avatar = url

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance



class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user


class FollowSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "followers_count", "following_count", "is_following"]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_is_following(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False