import os
from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import default_storage

from capstone import settings

def user_avatar_files_path(instance, filename):
    ext = filename.split('.')[-1]
    base_name = f"user-{instance.user.id}"
    new_filename = f"{base_name}.{ext}"

    for existing_file in default_storage.listdir(settings.AVATAR_IMAGES_PATH)[1]:
        if os.path.splitext(existing_file)[0] == base_name:
            default_storage.delete(os.path.join(settings.AVATAR_IMAGES_PATH, existing_file))
            break

    return f"{settings.AVATAR_IMAGES_PATH}{new_filename}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=user_avatar_files_path)


class Group(models.Model):
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    members = models.ManyToManyField(User)
    #closing_petition = 
    closed_at = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null=True)

    def __str__(self):
        return self.name


class Invitation(models.Model):
    inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_invitations')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='invitations')
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(blank=True, null=True)
    denied_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Group {self.group.name} - User {self.inviter.username} invites user {self.invitee.username}"
    
    
class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    spent_at = models.DateTimeField(blank=True, null=True)
    users_sharing_expense = models.ManyToManyField(User, related_name='shared_expenses', blank=True)

    def __str__(self):
        return f"Group {self.group.name} - Expense {self.id} - Amount {self.amount}"

    def total_shared_expense(self):
        num_users = self.users_sharing_expense.count()
        if num_users > 0:
            return self.amount / num_users
        return self.amount