from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from EstrayaApp import views

urlpatterns = [
    path('', views.homepage, name='estraya-home'),
    path('task/', views.TaskList.as_view()),
    path('task/<int:skill_id>/', views.TaskListBySkill.as_view()),
    path('task-byskill/<int:pk>/', views.TaskDetail.as_view()),
    path('user/', views.UserList.as_view()),
    path('user/<int:pk>/', views.UserDetail.as_view()),
    path('usertask/', views.UserTaskList.as_view()),
    path('usertask/<int:pk>/', views.UserTaskDetail.as_view()),
    path('usertask-byskill/<int:skill_id>/', views.UserTaskListBySkill.as_view()),
    path('usertask-skill/', views.UserTaskAndSkillList.as_view()),
    path('usertask-skill/<int:pk>/', views.UserTaskAndSkillDetail.as_view()),
]

urlpatterns += [
    path('estraya-auth/', views.CustomAuthToken.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
