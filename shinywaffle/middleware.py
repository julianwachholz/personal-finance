import os
import time

DELAY = float(os.getenv("API_DELAY", 0.0))


class TimeDelayMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if "/api/" in request.path:
            time.sleep(DELAY)
        response = self.get_response(request)
        return response
