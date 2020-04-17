export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const scrollTo = (myRef) => window.scrollTo(0, myRef.current.offsetTop);


export const checkValidity = ( value, rules ) => {
    let isValid = true;
    if ( !rules ) {
        return true;
    }

    if ( rules.required ) {
        isValid = value.trim() !== '' && isValid;
    }

    if ( rules.minLength ) {
        isValid = value.length >= rules.minLength && isValid
    }

    if ( rules.maxLength ) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if ( rules.isEmail ) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test( value ) && isValid
    }

    if ( rules.isNumeric ) {
        const pattern = /^\d+$/;
        isValid = pattern.test( value ) && isValid
    }

    return isValid;
}

export const toCss = ( ...classNames) => classNames.join(' ');
export const arrToCss = arr => arr.join(' ');

export const sameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
}

export const arrContainsDay = (arr, day) => {
    return arr.some(el => sameDay(day, el));
}

export const saveItem = (key, item) => {
    localStorage.setItem(key, JSON.stringify(item));
}

export const parseItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export const delItem = (key) => {
    localStorage.removeItem(key);
}