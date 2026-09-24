from fastapi import HTTPException


def api_error(status: int, code: str, message: str, details: dict | None = None,
              lang: str = 'ru') -> HTTPException:
    return HTTPException(status_code=status, detail={
        'error': {'code': code, 'message': message, 'lang': lang, 'details': details or {}}
    })
