from django.urls import path
from controls.views import AdminDashboardStatsView, AdminUserStatsView, AdminPostStatsView

urlpatterns = [
    path("stats/", AdminDashboardStatsView.as_view(), name="dashboard"),
    path("users/", AdminUserStatsView.as_view(), name="users"),
    path("posts/", AdminPostStatsView.as_view(), name="content"),
]