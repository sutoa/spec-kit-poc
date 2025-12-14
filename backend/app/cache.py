from typing import Any, Dict, Optional
import time

class Cache:
    def __init__(self, ttl: int = 300):  # Default TTL of 5 minutes
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            data = self._cache[key]
            if time.time() < data["expiry"]:
                return data["value"]
            else:
                self.delete(key)  # Expired
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        expiry = time.time() + (ttl if ttl is not None else self.ttl)
        self._cache[key] = {"value": value, "expiry": expiry}

    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        self._cache = {}

cache = Cache()