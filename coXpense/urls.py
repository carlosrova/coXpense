from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework import routers
from dynamic_rest.routers import DynamicRouter
from . import views

router = DynamicRouter()
router.register(r'users', views.UserViewSet)
router.register(r'userprofiles', views.UserProfileViewSet)
router.register(r'expenses', views.ExpenseViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'invitations', views.InvitationViewSet)


urlpatterns = [
    path('', include(router.urls)),

    path('login/', views.login_view, name='login'),

    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    path('csrf-token/', views.get_csrf_token, name='csrf_token'),
    
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('users/<int:id>/avatar/', views.UserAvatarView.as_view(), name='user-avatar'),

    path('groups/<int:group_id>/balance/', views.GroupBalance.as_view(), name='group-balance'),
]

# Must be replaced in production if site uses http server for media static files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)