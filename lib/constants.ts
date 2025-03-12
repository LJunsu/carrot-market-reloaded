export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = 
    new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
export const PASSWORD_REGEX_ERROR = 
    "비밀번호에는 대문자, 소문자, 숫자 및 특수 문자 #?@$%^&*-가 하나 이상 포함되어야 합니다.";