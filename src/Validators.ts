import { Document } from './Document'

export const validateRequiredFields = (_doc: any, requiredFields: string[]): void => {
  for (const field of requiredFields) {
    if (!_doc.hasOwnProperty(field))
      throw new RequiredFieldError(field)
  }
}

export const validateDataTypes = (_doc: any, document: Document): void => {
  if (document.__numberFields?.length)
    validateNumbers(_doc, document.__numberFields);

  if (document.__textFields?.length)
    validateStrings(_doc, document.__textFields)

  if (document.__booleanFields?.length)
    validateBooleans(_doc, document.__booleanFields)
}

const validateNumbers = (_doc: any, numberFields: string[]): void => {
  for (const field of numberFields) {
    if (_doc.hasOwnProperty(field) && typeof _doc[field] !== 'number')
      throw new InvalidFieldTypeError('Number', field)
  }
}

const validateStrings = (_doc: any, stringFields: string[]): void => {
  for (const field of stringFields) {
    if (_doc.hasOwnProperty(field) && typeof _doc[field] !== 'string')
      throw new InvalidFieldTypeError('String', field)
  }
}

const validateBooleans = (_doc: any, booleanFields: string[]): void => {
  for (const field of booleanFields) {
    if (_doc.hasOwnProperty(field) && typeof _doc[field] !== 'boolean')
      throw new InvalidFieldTypeError('Boolean', field)
  }
}

export class RequiredFieldError extends Error {
  constructor (field: string) {
    super(`Missing required field: '${field}'`)
  }
}

export class InvalidFieldTypeError extends Error {
  constructor (type: string, field: string) {
    super(`Field '${field}' must be of type '${type}'`)
  }
}
