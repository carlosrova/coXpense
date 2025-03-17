import os

from capstone import settings

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.db.models import Q

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from dynamic_rest.viewsets import DynamicModelViewSet

from .models import User, UserProfile, Group, Expense, Invitation
from .serializers import UserSerializer, UserProfileSerializer, GroupSerializer, ExpenseSerializer, InvitationSerializer

from .utils import print_obj


def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # Ensure the login endpoint is publicly accessible
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"login_view begin username = '{username}'   password='{password}'")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)  # This creates the session in the backend
        return Response({
            'message': 'Login successful',
            'user_id': user.id})
    else:
        return Response({'error': 'Invalid credentials'}, status=401)


class UserViewSet(DynamicModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]
    
    def perform_update(self, serializer):
        if self.request.user == serializer.instance:
            serializer.save()
        else:
            raise PermissionDenied("You do not have permission to modify this account.")


class UserProfileViewSet(DynamicModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserAvatarView(APIView):
    def get(self, request, id):
        try:
            user_profile = UserProfile.objects.get(user__id=id)
        except UserProfile.DoesNotExist:
            user_profile = None

        session_user = request.user

        if session_user.id == id:
            is_member = True
        else:
            # Check if the requested user's profile is a member of any group where the session user is a member
            is_member = Group.objects.filter(members=session_user).filter(members=user_profile.user).exists() if user_profile else False

        if is_member and user_profile and user_profile.avatar:
            avatar_path = user_profile.avatar.path
        else:
            avatar_path = os.path.join(settings.MEDIA_ROOT, settings.AVATAR_IMAGES_PATH, 'user-0.png')

        extension = avatar_path.split('.')[-1]
        with open(avatar_path, 'rb') as f:
            return HttpResponse(f.read(), content_type=f"image/{extension}")


class GroupViewSet(DynamicModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access

    def get_queryset(self):
        """
        Override get_queryset to return the groups where the user is a member or invited.
        """
        user = self.request.user

        # Groups where the user is a member
        member_groups = Q(members=user)

        # Groups where the user has been invited (groups that have invitations with this user as invitee)
        invited_groups = Q(invitations__invitee=user, invitations__denied_at=None)

        # Filter the groups where the user is a member or invited
        return Group.objects.filter(member_groups | invited_groups).distinct()

    def perform_create(self, serializer):
        """
        Override perform_create to always include the creator user as a member of the group
        """
        group = serializer.save()
        group.members.add(self.request.user)  # Add the creator as a member
        group.save()

    def update(self, request, *args, **kwargs):
        """
        Override the update method so that only members can modify the group.
        """
        group = get_object_or_404(Group, pk=kwargs.get('pk'))
        if request.user not in group.members.all():
            return self.permission_denied(request, message="You do not have permission to modify this group.")
        return super().update(request, *args, **kwargs)


class ExpenseViewSet(DynamicModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override get_queryset to return only the expenses where the user is a member of the group.
        """
        return Expense.objects.filter(group__members=self.request.user)

    def perform_create(self, serializer):
        """
        Only allow the creation of the expense if the user of the request is a member of the group of the expense.
        """
        group = serializer.validated_data.get('group')

        if group.members.filter(id=self.request.user.id).exists():
            serializer.save()
        else:
            raise PermissionDenied(f"You can't create an expense in this group ({group.id}) because you are not a member.")
    
    def update(self, request, *args, **kwargs):
        """
        Override the update method so that only members of the group can modify the expense.
        """
        get_object_or_404(self.get_queryset(), pk=kwargs.get('pk'))

        return super().update(request, *args, **kwargs)
    

class InvitationViewSet(DynamicModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_update(self, serializer):
        request_invitation = serializer.save()
        stored_invitation_exists = Invitation.objects.filter(group=request_invitation.group, invitee=self.request.user).exists()

        if stored_invitation_exists and request_invitation.accepted_at:
            request_group = request_invitation.group
            request_group.members.add(self.request.user)
            request_group.save()


class GroupBalance(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)

        if request.user not in group.members.all():
            raise PermissionDenied(f"You can't get a balance of this group (groupId {group.id}) because you are not a member.")
        
        expenses = Expense.objects.filter(group=group)
        members = User.objects.filter(group=group)
        max_balance_amount = 0
        balance_rows = []
        for user in members:
            paid_expenses = expenses.filter(user=user)
            shared_expenses = expenses.filter(users_sharing_expense=user)
            paid_amount = sum([exp.amount for exp in paid_expenses])
            shared_amount = sum([exp.amount/exp.users_sharing_expense.count() for exp in shared_expenses])
            balance_amount = paid_amount-shared_amount
            max_balance_amount = max(max_balance_amount, abs(balance_amount))
            balance_rows.append({
                "user":user.id,
                "amount":balance_amount
            })
        response = {
            "max_amount":max_balance_amount,
            "rows":balance_rows
        }
        return Response(response)
