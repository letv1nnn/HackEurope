"""
Custom exceptions for the backend application.
"""


class BackendException(Exception):
    """Base exception for backend errors."""
    pass


class ConfigurationError(BackendException):
    """Raised when configuration is invalid or missing."""
    pass


class DataNotFoundError(BackendException):
    """Raised when required data file is not found."""
    pass


class ClassificationError(BackendException):
    """Raised when classification process fails."""
    pass


class LLMError(BackendException):
    """Raised when LLM (Gemini) communication fails."""
    pass


class RemediationError(BackendException):
    """Raised when remediation process fails."""
    pass
