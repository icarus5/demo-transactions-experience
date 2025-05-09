import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { DateTimeScalar } from '../util/datetimescalar.util';

@ObjectType()
export class User {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;

  @Field({ nullable: true })
  document: string;
}

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field()
  numberOperation: string;

  @Field()
  codeSecurity: string;

  @Field()
  destinationAccount: string;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field()
  account: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  fecha: Date | null;

  @Field()
  amount: number;

  @Field()
  state: string;

  @Field()
  type: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date | null;

  @Field()
  isActive: boolean;

  @Field()
  createUser: string;
}
