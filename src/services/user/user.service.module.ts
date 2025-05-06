import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
