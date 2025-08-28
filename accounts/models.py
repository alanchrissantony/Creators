from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid, random, string
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class UserManager(BaseUserManager):

    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    bio = models.CharField(max_length=255, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)

    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return self.username
    
    @property
    def post_count(self):
        return self.posts.count()
    
    def generate_otp(self):
        otp = ''.join(random.choices(string.digits, k=6))
        self.otp = otp
        self.otp_created_at = timezone.now()
        self.save(update_fields=["otp", "otp_created_at"])
        return otp
    
    def verify_otp(self, otp):
        if self.otp != otp:
            return False
        if self.otp_created_at and timezone.now() > self.otp_created_at + timedelta(minutes=10):
            return False
        self.is_verified = True
        self.otp = None
        self.save(update_fields=["is_verified", "otp"])
        return True

