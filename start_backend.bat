@echo off
cd C:\Users\Administrator\Documents\EstrayaDev\EstrayaVenv\Scripts
call .\activate
cd C:\Users\Administrator\Documents\EstrayaDev\EstrayaProj
python manage.py runserver_plus --cert-file localhost.pem --key-file key.pem