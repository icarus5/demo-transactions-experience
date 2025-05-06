import { Module } from '@nestjs/common';
import { UserResolverModule } from './user/user.resolver.module';
import { DateTimeScalar } from '../commons/util/datetimescalar.util';
import { HttpModule } from '@nestjs/axios';
import { TransactionResolverModule } from './transaction/transaction.resolver.module';

@Module({
  imports: [UserResolverModule, TransactionResolverModule, HttpModule],
  exports: [UserResolverModule, TransactionResolverModule],
  providers: [DateTimeScalar],
})
export class ResolverModule {}
