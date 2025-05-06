import { Module } from '@nestjs/common';
import { TransactionService } from '../services/transaction/transaction.service';
import { TransactionResolvers } from '../resolvers/transaction/transaction.resolvers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [],
  providers: [TransactionService, TransactionResolvers],
  exports: [TransactionService],
})
export class TransactionModule {}
