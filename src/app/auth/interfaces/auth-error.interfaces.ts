export interface HTTPErrorResponseCustom {
    message: string;
    errors:  Errors;
}

export interface Errors {
    [key: string]: string[];
}
