import logging
import sys
from logging.handlers import RotatingFileHandler

def configure_logging(app_name: str = "account_viewer", level: str = "INFO"):
    """
    Configures application-wide logging.
    """
    # Create logger
    logger = logging.getLogger(app_name)
    logger.setLevel(level)

    # Prevent propagation to the root logger
    logger.propagate = False

    # Create formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Optional: File Handler for production environments
    # file_handler = RotatingFileHandler(
    #     f"{app_name}.log", maxBytes=10485760, backupCount=5
    # )
    # file_handler.setLevel(logging.INFO)
    # file_handler.setFormatter(formatter)
    # logger.addHandler(file_handler)

    # Example: Integrate with Uvicorn's loggers
    # access_logger = logging.getLogger("uvicorn.access")
    # access_logger.handlers = [console_handler]
    # access_logger.setLevel(level)

    # error_logger = logging.getLogger("uvicorn.error")
    # error_logger.handlers = [console_handler]
    # error_logger.setLevel(level)

    return logger

# Configure logging on import
logger = configure_logging()