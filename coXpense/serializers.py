from django.db import IntegrityError
from django.core.exceptions import ValidationError
from .models import User, Group, Expense, Invitation, UserProfile
from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer, UniqueFieldsMixin, NestedUpdateMixin, NestedCreateMixin
from dynamic_rest.serializers import DynamicModelSerializer, DynamicRelationField
from .utils import print_obj

class UserSerializer(UniqueFieldsMixin, DynamicModelSerializer):
    received_invitations = DynamicRelationField('InvitationSerializer', many=True, read_only=True)
    userprofile = DynamicRelationField('UserProfileSerializer', many=False, read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    retyped_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'received_invitations', 'userprofile', 'password', 'retyped_password']

    def create(self, validated_data):
        print('UserSerializer.create(...)')

        # Extraer password y retyped_password
        password = validated_data.pop('password', None)
        retyped_password = validated_data.pop('retyped_password', None)

        # Validar que las contraseñas coincidan
        if password != retyped_password:
            raise ValidationError("Las contraseñas no coinciden.")

        try:
            user = User(**validated_data)
            user.set_password(password)  # Asegurarse de guardar la contraseña encriptada
            user.save()
            return user
        except IntegrityError as e:
            if 'UNIQUE constraint' in str(e):
                raise serializers.ValidationError({"username": "This username is already taken. Please choose another."})
            raise e

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            print(f"Serializers.py attr='{attr}' value='{value}' ")
            setattr(instance, attr, value)

        # Handle password change
        if password:
            instance.set_password(password)

        try:
            instance.save()
            return instance
        except IntegrityError as e:
            # Handle duplicate username case
            if 'UNIQUE constraint' in str(e):
                raise serializers.ValidationError({"username": "This username is already taken. Please choose another."})
            raise e


class UserProfileSerializer(NestedUpdateMixin, NestedCreateMixin, DynamicModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class ExpenseSerializer(NestedUpdateMixin, NestedCreateMixin, DynamicModelSerializer):
    id = serializers.ReadOnlyField()
    user = DynamicRelationField('UserSerializer')
    users_sharing_expense = DynamicRelationField('UserSerializer', many=True)

    class Meta:
        model = Expense
        fields = '__all__'


class GroupSerializer(DynamicModelSerializer):
    id = serializers.ReadOnlyField()
    expenses = DynamicRelationField('ExpenseSerializer', many=True)
    members = DynamicRelationField('UserSerializer', many=True)
    invitations = DynamicRelationField('InvitationSerializer', many=True)

    class Meta:
        model = Group
        fields = '__all__'


class InvitationSerializer(NestedUpdateMixin, NestedCreateMixin, DynamicModelSerializer):
    id = serializers.ReadOnlyField()
    inviter = DynamicRelationField('UserSerializer')
    invitee = DynamicRelationField('UserSerializer')

    class Meta:
        model = Invitation
        fields = '__all__'