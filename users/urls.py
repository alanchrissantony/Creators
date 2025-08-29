from django.urls import path
from users.views import UserUpdateView, ChangePasswordView, ListUsersView, FollowView

urlpatterns = [
    path('', ListUsersView.as_view(), name='users'),
    path('<uuid:user_id>/', ListUsersView.as_view(), name='user'),
    path("<uuid:user_id>/update/", UserUpdateView.as_view(), name="update-user"),
    path('<uuid:user_id>/password/', ChangePasswordView.as_view(), name='change-password'),
    path('<uuid:user_id>/follow/', FollowView.as_view(), name='follow'),
]
