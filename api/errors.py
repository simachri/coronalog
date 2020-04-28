class ClogException(Exception):
    pass

class PurposeIdException(ClogException):
    pass
class UnverifiedRoleException(ClogException):
    pass
class UserNotExistsException(ClogException):
    pass
class UserAlreadyExistsException(ClogException):
    pass
class InvalidPasswordException(ClogException):
    pass
class AuthenticationException(ClogException):
    pass
class InvalidUsagePurposeException(ClogException):
    pass