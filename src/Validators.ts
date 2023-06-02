import { ObjectId } from 'mongodb';
import { Document } from './Document';

export const validateRequiredFields = (_doc: any, requiredFields: string[]): void => {
    for (const field of requiredFields) {
        if (!_doc.hasOwnProperty(field))
            throw new RequiredFieldError(field);
    }
}

export const validateDataTypes = (_doc: any, document: Document): void => {
    if (document.__numberFields?.length)
        validateNumbers(_doc, document.__numberFields);

    if (document.__textFields?.length)
        validateStrings(_doc, document.__textFields);

    if (document.__booleanFields?.length)
        validateBooleans(_doc, document.__booleanFields);

    if (document.__objectIdFields?.length)
        validateObjectIds(_doc, document.__objectIdFields);

    if (document.__emailFields?.length)
        validateEmails(_doc, document.__emailFields);

    if (document.__dateFields?.length)
        validateDates(_doc, document.__dateFields);
}

const validateNumbers = (_doc: any, numberFields: string[]): void => {
    for (const field of numberFields) {
        if (_doc.hasOwnProperty(field) && typeof _doc[field] !== 'number')
            throw new InvalidFieldTypeError('Number', field);
    }
}

const validateStrings = (_doc: any, stringFields: string[]): void => {
    for (const field of stringFields) {
        if (_doc.hasOwnProperty(field) && typeof _doc[field] !== 'string')
            throw new InvalidFieldTypeError('String', field);
    }
}

const validateBooleans = (_doc: any, booleanFields: string[]): void => {
    for (const field of booleanFields) {
        if (_doc.hasOwnProperty(field) && typeof _doc[field] !== 'boolean')
            throw new InvalidFieldTypeError('Boolean', field);
    }
}

const validateObjectIds = (_doc: any, objectIdFields: string[]): void => {
    for (const field of objectIdFields) {
        if (_doc.hasOwnProperty(field) && !ObjectId.isValid(_doc[field]))
            throw new InvalidFieldTypeError('ObjectId', field);
    }
}

const validateDates = (_doc: any, dateFields: string[]): void => {
    for (const field of dateFields) {
        if (_doc.hasOwnProperty(field)) {
            if (!(_doc[field] instanceof Date && !isNaN(_doc[field])))
                throw new InvalidFieldTypeError('ObjectId', field)
        }
    }
}

const validateEmails = (_doc: any, emailFields: string[]): void => {
    for (const field of emailFields) {
        if (_doc.hasOwnProperty(field)) {
            const regex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
            const email = _doc[field];
            if (email.length > 256)
                throw new InvalidFieldTypeError('Email', field);

            if (!regex.test(email))
                throw new InvalidFieldTypeError('Email', field);

            const parts = email.split("@");
            if (parts[0].length > 64)
                throw new InvalidFieldTypeError('Email', field);

            const domainParts = parts[1].split(".");
            if (domainParts.some((part) => part.length > 64))
                throw new InvalidFieldTypeError('Email', field);
        }
    }
}

export class RequiredFieldError extends Error {
    constructor (field: string) {
        super(`Missing required field: '${field}'`);
    }
}

export class InvalidFieldTypeError extends Error {
    constructor (type: string, field: string) {
        super(`Field '${field}' must be of type '${type}'`);
    }
}
