@echo off
cd C:\Users\Administrator\Documents\EstrayaDev\EstrayaVenv\Scripts
call .\activate
cd C:\Users\Administrator\Documents\EstrayaDev\EstrayaProj
python manage.py runserver_plus localhost:8000 --cert-file localhost.crt --key-file localhost.key