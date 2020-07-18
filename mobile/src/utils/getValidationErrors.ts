import { ValidationError } from 'yup';

interface Erros {
  [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Erros {
  const validationError: Erros = {};

  err.inner.forEach(error => {
    validationError[error.path] = error.message;
  });
  return validationError;
}
