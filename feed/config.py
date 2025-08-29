# utils/supabase_client.py
from django.conf import settings
from supabase import create_client, Client

class SupabaseClient:
    _instance = None
    
    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            cls._instance = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return cls._instance

supabase = SupabaseClient.get_client()