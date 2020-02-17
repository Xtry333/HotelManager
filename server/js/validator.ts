function validate(value: string, type: string) {
    switch (type) {
        case 'email': 
            return validateEmail(value);
    }
}

export function isEmpty(value: string) {
    return !(value && value.length > 0);
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function validateEmail(value: string) {
    return emailRegex.test(value);
}

export default validate;