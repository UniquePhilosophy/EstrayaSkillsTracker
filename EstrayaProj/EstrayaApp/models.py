from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.authtoken.models import Token

class ExpiringToken(Token):
    expiry = models.DateTimeField(default=timezone.now)

class Skill(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    parent = models.ManyToManyField(
        'self', 
        blank=True, 
        null=True, 
        symmetrical=False, 
        related_name='children'
    )
    image_url = models.URLField(blank=True, default='https://picsum.photos/200/200')
    
    def __str__(self):
        return self.name
        
class Language(models.Model):
    name = models.CharField(max_length=200)
    
    class Meta:
        ordering = ['name']
        
    def __str__(self):
        return self.name
        
class LanguageTask(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    prerequisite = models.ManyToManyField('self', blank=True, null=True)
    
    def __str__(self):
        return self.name
        
class UserLanguage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    languageTask = models.ForeignKey(LanguageTask, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['user']
        
    def __str__(self):
        return self.languageTask
        
class Task(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    prerequisite = models.ManyToManyField('self', blank=True, null=True, symmetrical=False)
    skill = models.ManyToManyField(Skill)
    image_url = models.URLField(blank=True, default='https://picsum.photos/100')
    
    def __str__(self):
        return str(self.name)
        
class UserTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['user']
    
    def __str__(self):
        return str(self.task)
    