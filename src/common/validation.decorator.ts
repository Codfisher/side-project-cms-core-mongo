import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

@ValidatorConstraint({ async: true })
export class IsMongoObjectIdConstraint implements ValidatorConstraintInterface {
  validate(text: any, args: ValidationArguments) {
    return ObjectId.isValid(text);
  }

  defaultMessage(args: ValidationArguments) {
    return '必須為 Mongo ObjectId';
  }
}

export function IsMongoObjectId(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMongoObjectIdConstraint,
    });
  };
}
