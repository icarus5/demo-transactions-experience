import { Module } from '@nestjs/common';
import { UserServiceModule } from './user';
import { TransactionServiceModule } from './transaction';

@Module({
  imports: [UserServiceModule, TransactionServiceModule],
  exports: [UserServiceModule, TransactionServiceModule],
})
export class ServicesModule {}
