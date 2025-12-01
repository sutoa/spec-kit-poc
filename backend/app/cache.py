import time
from typing import Any, Dict

class Cache:
    def __init__(self, default_ttl: int = 300): # Default TTL of 5 minutes
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl

    def set(self, key: str, value: Any, ttl: int = None):
        if ttl is None:
            ttl = self.default_ttl
        expiration_time = time.time() + ttl
        self._cache[key] = {"value": value, "expires_at": expiration_time}

    def get(self, key: str) -> Any | None:
        item = self._cache.get(key)
        if item is None:
            return None
        
        if time.time() > item["expires_at"]:
            self.delete(key)
            return None
        
        return item["value"]

    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        self._cache.clear()

cache = Cache() # Instantiate a global cache object