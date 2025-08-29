from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from feed.models import Post
from users.serializers import UserSerializer
from django.utils.timezone import now
from feed.serializers import PostListSerializer
from accounts.authentication import CookieJWTAuthentication

User = get_user_model()

class AdminDashboardStatsView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        total_users = User.objects.count()
        total_active_users = User.objects.filter(is_active=True).count()
        total_verified_users = User.objects.filter(is_verified=True).count()
        total_posts = Post.objects.count()

        recent_users = User.objects.order_by("-created_at")[:10]
        recent_users_data = UserSerializer(recent_users, many=True).data

        data = {
            "total_users": total_users,
            "total_active_users": total_active_users,
            "total_verified_users": total_verified_users,
            "total_posts": total_posts,
            "recent_users": recent_users_data,
        }

        return Response(data)


class AdminUserStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        total_users = User.objects.count()
        total_active_users = User.objects.filter(is_active=True).count()
        total_non_active_users = User.objects.filter(is_active=False).count()
        total_verified_users = User.objects.filter(is_verified=True).count()

        all_users = User.objects.all().order_by("-date_joined")
        users_data = UserSerializer(all_users, many=True).data

        data = {
            "total_users": total_users,
            "total_active_users": total_active_users,
            "total_non_active_users": total_non_active_users,
            "total_verified_users": total_verified_users,
            "users": users_data,
        }

        return Response(data)
    

class AdminPostStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        current_date = now()
        current_year = current_date.year
        current_month = current_date.month

        total_posts = Post.objects.count()
        total_posts_year = Post.objects.filter(created_at__year=current_year).count()
        total_posts_month = Post.objects.filter(
            created_at__year=current_year, created_at__month=current_month
        ).count()

        all_posts = Post.objects.all().order_by("-created_at")
        posts_data = PostListSerializer(all_posts, many=True).data

        data = {
            "total_posts": total_posts,
            "total_posts_year": total_posts_year,
            "total_posts_month": total_posts_month,
            "posts": posts_data,
        }

        return Response(data)
    

