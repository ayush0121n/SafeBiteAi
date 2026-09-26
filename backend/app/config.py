from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    environment: str = "development"
    cors_origins: str = "http://localhost:5173,https://safebiteai-ai.vercel.app"
    max_upload_size_mb: int = 10
    upload_directory: str = "uploads"
    ocr_api_key: str = "helloworld"
    enable_label_region_detection: bool = False
    ml_container_url: str = ""
    ml_container_api_key: str = "local_ml_key"
    hugging_face_api_key: str = ""
    usda_api_key: str = ""

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"


settings = Settings()
