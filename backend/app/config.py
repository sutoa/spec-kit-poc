from pydantic import BaseModel, Field
from dotenv import dotenv_values # Import dotenv_values

# Load environment variables from .env file
config_values = dotenv_values(".env")

class Settings(BaseModel):
    # Use Field to specify default values and read from environment
    SNAPTRADE_CLIENT_ID: str = Field(default=config_values.get("SNAPTRADE_CLIENT_ID", ""))
    SNAPTRADE_CLIENT_SECRET: str = Field(default=config_values.get("SNAPTRADE_CLIENT_SECRET", ""))
    SECRET_KEY: str = Field(default=config_values.get("SECRET_KEY", "a_very_secret_key"))
    ALGORITHM: str = Field(default=config_values.get("ALGORITHM", "HS256"))
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=int(config_values.get("ACCESS_TOKEN_EXPIRE_MINUTES", 15)))
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=int(config_values.get("REFRESH_TOKEN_EXPIRE_DAYS", 7)))

settings = Settings()
