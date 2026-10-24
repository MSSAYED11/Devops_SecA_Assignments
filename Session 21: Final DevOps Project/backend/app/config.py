from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Restaurant Management API"
    database_url: str = "postgresql+psycopg://restaurant_user:restaurant_password@localhost:5432/restaurant_db"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
