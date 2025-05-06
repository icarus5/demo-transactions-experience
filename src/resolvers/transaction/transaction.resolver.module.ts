import { Module } from '@nestjs/common';
import { ServicesModule } from '../../services';
import { TransactionResolvers } from './transaction.resolvers';

@Module({
  imports: [ServicesModule],
  providers: [TransactionResolvers],
  exports: [],
})
export class TransactionResolverModule {}
