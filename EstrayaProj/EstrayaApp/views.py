from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from rest_framework import generics, permissions, status
from rest_framework.authentication import BasicAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import *
from .models import Language, LanguageTask, Skill, Task, UserTask, UserLanguage, ExpiringToken
from .permissions import IsOwnerOrReadOnly
from .authentication import CookieTokenAuthentication

def homepage(request):
    languages = Language.objects.all()
    return render(request, 'EstrayaApp/homepage.html', {'languages': languages})

class TaskList(generics.ListCreateAPIView):
    authentication_classes = []
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = []
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskListBySkill(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        skill_id = self.kwargs['skill_id']
        return Task.objects.filter(skill=skill_id)

class SkillList(generics.ListCreateAPIView):
    authentication_classes = []
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class SkillDetail(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = []
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class UserList(generics.ListAPIView):
    authentication_classes = []
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    authentication_classes = []
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserTaskList(generics.ListCreateAPIView):
    authentication_classes = [CookieTokenAuthentication]
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

class UserTaskListBySkill(generics.ListCreateAPIView):
    serializer_class = UserTaskSerializer
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        skill_id = self.kwargs['skill_id']

        tasks = Task.objects.filter(skill=skill_id)

        user_tasks = UserTask.objects.filter(user=user_id, task__in=tasks)
        print(f'user_tasks: {user_tasks}')

        return user_tasks


class UserTaskAndSkillList(generics.ListCreateAPIView):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskAndSkillSerializer
    authentication_classes = []
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')

        if user_id:
            user_id = int(user_id)
            if user_id != self.request.user.id:
                return UserTask.objects.filter(user=user_id)
        
        return UserTask.objects.filter(user=self.request.user)


    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserTaskAndSkillDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskAndSkillSerializer
    authentication_classes = []
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CustomAuthToken(ObtainAuthToken):
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        expiry = timezone.now() + timedelta(days=7)
        token, created = ExpiringToken.objects.get_or_create(user=user)
        if not created:
            token.expiry = expiry
            token.save()
        response = Response({
            'user_id': user.pk,
            'name': user.username,
            'expiry': expiry.isoformat()
        })
        response.set_cookie(
            key='authToken', 
            value=token.key, 
            httponly=True, 
            secure=True, 
            samesite='None', 
            expires=expiry,
            path='/'
            )
        return response
