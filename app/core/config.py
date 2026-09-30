import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "RightCard Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database connection URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:123456@localhost:5432/rightcard_db"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
