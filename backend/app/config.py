from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    DATABASE_URL: str = "sqlite:///./account_viewer.db"
    SNAPTRADE_CLIENT_ID: str
    SNAPTRADE_CONSUMER_KEY: str
    SNAPTRADE_REDIRECT_URI: str = "http://localhost:5173/snaptrade/callback" # Example default
    CACHE_TTL: int = 300

settings = Settings()
