from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import Post
from .serializers import PostCreateSerializer, PostListSerializer, PostUpdateSerializer




class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50




class PostCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class PostListView(APIView):
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        posts = Post.objects.filter(is_active=True)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(posts, request)
        serializer = PostListSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)




class PostDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, is_active=True)
        serializer = PostListSerializer(post)
        return Response(serializer.data)




class PostUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, user=request.user, is_active=True)
        serializer = PostUpdateSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, user=request.user, is_active=True)
        serializer = PostUpdateSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class PostDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id, user=request.user)
        post.is_active = False
        post.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
