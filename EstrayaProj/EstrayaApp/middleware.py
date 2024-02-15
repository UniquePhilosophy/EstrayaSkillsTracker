from django.utils import timezone
from .models import ExpiringToken
from rest_framework.response import Response

class TokenExpiryMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path != '/estraya-auth/':
            auth_token = request.COOKIES.get('authToken')
            print(f'[Middleware] cookie: {auth_token}')
            if auth_token:
                token = ExpiringToken.objects.filter(key=auth_token).first()
                print(f'[Middleware] token: {token}')
                if token and timezone.now() > token.expiry:
                    return Response({'error': 'Token expired'}, status=401)
        return self.get_response(request)
