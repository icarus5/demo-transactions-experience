import { Module } from '@nestjs/common';
import { ServicesModule } from '../../services';
import { UserResolver } from './user.resolver';

@Module({
  imports: [ServicesModule],
  providers: [UserResolver],
})
export class UserResolverModule {}
