import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field()
  numberOperation: string;

  @Field()
  codeSecurity: string;

  @Field()
  destinationAccount: string;

  @Field()
  userId: string;

  @Field()
  account: string;

  @Field(() => GraphQLISODateTime)
  fecha: Date;

  @Field()
  amount: number;

  @Field()
  state: string;

  @Field()
  type: string;

  @Field()
  isActive: boolean;
}
