// maps server error response to error message that is shown to user

export const getErrorMessage = key => {
    switch(key) {
        case 'USER_NOT_FOUND':
            return 'Dieser Nutzer existiert nicht'
        case 'WRONG_PASSWORD':
            return 'Falsches Passwort'
        case 'SERVER_ERROR':
            return 'Unerwarteter Server Fehler'
        case 'USER_EXISTS':
            return 'Dieser Nutzername existiert bereits'
        case 'INVALID_TOKEN':
            return 'Unauthorisierter Zugriff'
        default:
            return 'Unerwarteter Fehler'
    }
}