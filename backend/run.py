#!/usr/bin/env python
import os
from app import create_app

# Criar aplicação
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    host = os.getenv('API_HOST', '0.0.0.0')
    debug = os.getenv('FLASK_ENV') == 'development'
    
    app.run(host=host, port=port, debug=debug)
