from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, UserTask, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = '__all__'

class TaskSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(many=True)

    class Meta:
        model = Task
        fields = '__all__'

class UserTaskAndSkillSerializer(serializers.ModelSerializer):
    task = TaskSkillSerializer()
    user = UserSerializer()

    class Meta:
        model = UserTask
        fields = '__all__'
