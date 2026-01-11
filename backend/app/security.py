# backend/app/security.py

import html
from typing import Any

def sanitize_input(data: str) -> str:
    """
    Sanitizes string input to prevent common injection attacks.
    For more complex scenarios, specific validation/sanitization libraries should be used.
    """
    return html.escape(data)

def validate_uuid(uuid_string: str) -> bool:
    """
    Basic UUID format validation.
    """
    try:
        # Attempt to parse the UUID string. If it's invalid, a ValueError will be raised.
        # This also handles the case where the UUID is a different version than expected,
        # but for simple format validation, this is often sufficient.
        import uuid
        uuid.UUID(uuid_string)
        return True
    except ValueError:
        return False

# Further security considerations (e.g., password hashing, JWT handling)
# would be added here as the project evolves.
