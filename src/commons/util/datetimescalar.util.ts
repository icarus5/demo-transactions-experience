import { Kind, ValueNode, print } from 'graphql';
import { CustomScalar, Scalar } from '@nestjs/graphql';

@Scalar('CustomDateTime')
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'DateTime scalar type';

  serialize(value: Date | string): string {
    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        throw new Error('DateTime cannot serialize invalid Date object');
      }
      return value.toISOString();
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('DateTime cannot serialize invalid date string');
      }
      return date.toISOString();
    }
    throw new Error(`DateTime cannot serialize value of unsupported type: ${typeof value}`);
  }

  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new Error(`DateTime cannot parse value of type: ${typeof value}`);
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`DateTime cannot parse invalid date string`);
    }
    return date;
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new Error(`DateTime cannot represent literal kind: ${ast.kind}`);
    }
    const date = new Date(ast.value);
    if (isNaN(date.getTime())) {
      throw new Error('DateTime cannot represent invalid date literal');
    }
    return date;
  }
}
