from supabase import create_client, Client
from app.config import settings
import logging

def get_supabase_client() -> Client | None:
    if not settings.supabase_url or not settings.supabase_key:
        logging.warning("Supabase URL or Key is missing. Falling back to mock DB in memory.")
        return None
    try:
        return create_client(settings.supabase_url, settings.supabase_key)
    except Exception as e:
        logging.error(f"Failed to initialize Supabase client: {e}")
        return None

supabase_client = get_supabase_client()
