from pydantic import BaseSettings

class Settings(BaseSettings):
    snaptrade_client_id: str = "test_client_id"
    snaptrade_client_secret: str = "test_client_secret"
    secret_key: str = "your-secret-key"  # CHANGE THIS IN PRODUCTION

    class Config:
        env_file = ".env"

settings = Settings()