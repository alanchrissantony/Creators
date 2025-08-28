from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User
from django.contrib.auth.password_validation import validate_password

class UserRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password"]

    def create(self, validated_data):

        email = validated_data.get("email")
        username = email.split("@")[0]
        validated_data["username"] = username

        user = User.objects.create_user(**validated_data)
        otp = user.generate_otp()

        print(f"OTP for {user.email}: {otp}")

        return user
    
    

class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError({"error": "Invalid email or password"})
        
        if not user.is_verified:
            raise serializers.ValidationError({"error": "Account not verified. Please verify OTP."})
        
        if not user.is_active:
            raise serializers.ValidationError({"error": "Your account is temporarily suspended."})
        
        attrs["user"] = user
        return attrs


class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found"})
        
        if not user.verify_otp(otp):
            raise serializers.ValidationError({"otp": "Invalid or expired OTP"})
        
        attrs["user"] = user
        return attrs
    

class ResendOTPSerializer(serializers.Serializer):
    
    email = serializers.EmailField()

    def validate_email(self, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("No account found with this email.")

        if user.is_verified:
            raise serializers.ValidationError("Account is already verified.")
        
        return email
    

class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        validate_password(attrs["new_password"])
        return attrs
    
    def save(self, **kwargs):
        email = self.validated_data["email"]
        otp = self.validated_data["otp"]
        new_password = self.validated_data["new_password"]

        try:
            user = User.objects.get(email=email, otp=otp)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid email or OTP"})

        user.set_password(new_password)
        user.otp=None
        user.save()

        return user