export function patternValidators() {
    return {
        mobileNumberRegExp: '^[6-9]{1}[0-9]{9}$',
        emailIdRegExp: '[a-zA-Z]+[a-zA-Z0-9._-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-]{1,5}\.[a-zA-Z]{2,4}',
        userNameRegExp: '^[a-zA-Z]+(( |-|_|@)?[a-zA-Z ]+)*$',
        empCodeRegExp: '^[a-zA-Z0-9\-]{2,20}',
        // passwordRegExp: '^(?=.{6,})(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$'
        passwordRegExp: '^(?=.{8,})(?=.*[0-9])(?=.*[a-zA-Z]).*$'
    }
}
