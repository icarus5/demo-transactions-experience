import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SignIn {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  password: string;
}

@ObjectType()
export class SignInResponse {
  @Field({ nullable: true })
  access_token: string;

  @Field({ nullable: true })
  token_type: string;

  @Field({ nullable: true })
  expires_in: string;

  @Field({ nullable: true })
  refresh_token: string;

  @Field({ nullable: true })
  id_token: string;
}

export class UserInfoB2CDto {
  oid: string;
  sub: string;
  name: string;
  family_name?: string; // El apellido es opcional ya que podría no estar siempre presente
  email?: string; // El email también es opcional
  // Puedes agregar más campos relevantes según tus necesidades
}

@ObjectType()
export class UserInfo {
  @Field({ nullable: true })
  oid_azure_b2c: string;
  @Field({ nullable: true })
  sub: string;
  @Field({ nullable: true })
  document: string;
  @Field({ nullable: true })
  fullName?: string; // El apellido es opcional ya que podría no estar siempre presente
}
