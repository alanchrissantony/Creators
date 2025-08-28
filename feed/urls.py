from django.urls import path
from .views import (
    PostCreateView, PostListView, PostDetailView,
    PostUpdateView, PostDeleteView
)

urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('create/', PostCreateView.as_view(), name='post-create'),
    path('posts/<uuid:post_id>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<uuid:post_id>/update/', PostUpdateView.as_view(), name='post-update'),
    path('posts/<uuid:post_id>/delete/', PostDeleteView.as_view(), name='post-delete'),
]
