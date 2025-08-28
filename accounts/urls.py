from django.urls import path
from accounts.views import UserRegisterView, UserLoginView, UserLogoutView, VerifyOTPView, ResendOTPView, RefreshTokenView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('verify/', VerifyOTPView.as_view(), name='verify'),
    path('resend/', ResendOTPView.as_view(), name='resend'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
]
