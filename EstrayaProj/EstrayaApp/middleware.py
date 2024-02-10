from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class TokenExpiryMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path != '/estraya-auth/':
            auth_token = request.COOKIES.get('authToken')
            print(f'[Middleware] authToken: {auth_token}')
            if auth_token:
                token = Token.objects.filter(key=auth_token).first()
                # if token and timezone.now() > auth_token.expires:
                #     return Response({'error': 'Token expired'}, status=401)
        return self.get_response(request)
