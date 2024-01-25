from django.contrib import admin
from .models import Language, LanguageTask, Skill, Task, UserTask, UserLanguage

admin.site.register(Language)
admin.site.register(LanguageTask)
admin.site.register(Skill)
admin.site.register(Task)
admin.site.register(UserTask)
admin.site.register(UserLanguage)