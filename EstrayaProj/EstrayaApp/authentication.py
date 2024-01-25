from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieTokenAuthentication(TokenAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get('authToken')
        print(f'Cookies: {request.COOKIES}')
        print(f'Token: {token}')

        if not token:
            raise AuthenticationFailed('No token provided')

        token_model = self.get_model()

        try:
            token_obj = token_model.objects.get(key=token)
        except token_model.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if token_obj.expiry < timezone.now():
            raise AuthenticationFailed('Token expired')

        return (token_obj.user, token_obj)
