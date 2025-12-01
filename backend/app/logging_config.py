import logging
import sys

# Configure root logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Create a console handler with a formatter for structured output
console_handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter(
    '{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s", "name": "%(name)s", "funcName": "%(funcName)s", "lineno": %(lineno)d}'
)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Optionally, configure specific loggers for libraries to reduce verbosity
logging.getLogger("uvicorn").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
