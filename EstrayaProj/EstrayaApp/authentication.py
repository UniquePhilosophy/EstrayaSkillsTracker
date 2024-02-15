from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import ExpiringToken


class CookieTokenAuthentication(TokenAuthentication):
    print(f'Initiating Custom Authentication Class...')

    def get_model(self):
        return ExpiringToken
    
    def authenticate(self, request):
        token = request.COOKIES.get('authToken')
        print(f'[Authentication.py] Cookies: {request.COOKIES}')
        print(f'[Authentication.py] Cookie: {token}')

        if not token:
            raise AuthenticationFailed('No token provided')

        token_model = self.get_model()

        try:
            token_obj = token_model.objects.get(key=token)
            print(f'[Authentication.py] Token: {token_obj}')
        except token_model.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if token_obj.expiry < timezone.now():
            raise AuthenticationFailed('Token expired')

        return (token_obj.user, token_obj)
