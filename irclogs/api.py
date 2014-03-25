from .core import api
from .models import Message

api.create_api(Message, results_per_page=25, url_prefix='/api/v1')
