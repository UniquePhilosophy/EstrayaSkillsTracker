# Generated by Django 4.2.5 on 2023-10-08 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EstrayaApp', '0005_alter_skill_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='skill',
            name='parent',
            field=models.ManyToManyField(blank=True, null=True, related_name='following', to='EstrayaApp.skill'),
        ),
    ]
