from cachetools import TTLCache

# Cache for 5 minutes
cache = TTLCache(maxsize=128, ttl=300)
