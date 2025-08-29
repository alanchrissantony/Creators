from django.urls import path
from .views import (
    PostCreateView, PostListView, PostDetailView,
    PostUpdateView, PostDeleteView, ToggleLikePostView, CreateCommentView
)

urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('create/', PostCreateView.as_view(), name='post-create'),
    path('<uuid:post_id>/', PostDetailView.as_view(), name='post-detail'),
    path('<uuid:post_id>/update/', PostUpdateView.as_view(), name='post-update'),
    path('<uuid:post_id>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('<uuid:pk>/like/', ToggleLikePostView.as_view(), name='toggle-like-post'),
    path("<uuid:post_id>/comments/create/", CreateCommentView.as_view(), name="create-comment"),
]
