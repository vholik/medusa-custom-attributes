import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isUniqueArray", async: false })
class IntAttributesValidator implements ValidatorConstraintInterface {
  validate(object: any[]) {
    if (!object || typeof object !== "object") {
      return false;
    }

    for (const key in object) {
      if (
        !object.hasOwnProperty(key) ||
        !Array.isArray(object[key]) ||
        !object[key].every((value) => !isNaN(Number(value))) ||
        object[key].length < 1 ||
        object[key].length > 2
      ) {
        return false;
      }
    }

    return true;
  }

  defaultMessage() {
    return `'int_attributes' must have the form {[string]: [number, number?]}`;
  }
}

export function IsValidIntAttributes(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IntAttributesValidator,
    });
  };
}
